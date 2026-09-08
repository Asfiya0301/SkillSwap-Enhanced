import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as api from '../api/services';
import { openSkillPdf } from '../utils/skillPdf';

const downloadAttachment = (attachment) => {
  if (!attachment?.url) return;

  const link = document.createElement('a');
  link.href = attachment.url;
  link.download = attachment.name || 'shared-document.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const topicResources = (title = '') => {
  const topic = title.toLowerCase();
  if (topic.includes('python')) {
    return {
      books: ['Python Crash Course: syntax, functions, and projects', 'Automate the Boring Stuff: practical scripts'],
      links: [
        ['Python official tutorial', 'https://docs.python.org/3/tutorial/'],
        ['Exercism Python practice', 'https://exercism.org/tracks/python']
      ],
      assignments: ['Write a calculator that handles invalid input', 'Build a command-line quiz with a score report', 'Explain one Python concept to your exchange partner'],
      questions: ['Which collection stores key-value pairs in Python?', 'What keyword defines a reusable function?', 'Which block handles an exception?'],
      answers: ['dictionary', 'def', 'except']
    };
  }
  if (topic.includes('javascript') || topic.includes('react')) {
    return {
      books: ['Eloquent JavaScript: language fundamentals', 'You Don’t Know JS Yet: scope and async concepts'],
      links: [['MDN JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'], ['React Learn', 'https://react.dev/learn']],
      assignments: ['Build a small interactive form', 'Fetch and render data from a public API', 'Share a component or function for peer feedback'],
      questions: ['Which keyword declares a block-scoped constant?', 'What does async/await help manage?', 'What is a React component used to describe?'],
      answers: ['const', 'promise', 'ui']
    };
  }
  return {
    books: ['The selected skill guide from SkillSwap', 'A practical reference chosen with your exchange partner'],
    links: [['MDN Web Docs', 'https://developer.mozilla.org/'], ['freeCodeCamp curriculum', 'https://www.freecodecamp.org/learn/']],
    assignments: ['Write down three learning goals', 'Complete one small practice exercise', 'Share your result and one question with your exchange partner'],
    questions: ['What is the main concept you want to master?', 'What would a useful beginner project look like?', 'How will you check your progress?'],
    answers: ['', '', '']
  };
};

const createProgress = () => ({
  checked: [],
  answers: ['', '', ''],
  submitted: false
});

const LearningWorkspace = () => {
  const { requestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(location.state?.request || null);
  const [acceptedRequests, setAcceptedRequests] = useState(location.state?.request ? [location.state.request] : []);
  const [loading, setLoading] = useState(!location.state?.request);
  const [activeRequestId, setActiveRequestId] = useState(location.state?.request?._id || requestId || null);
  const [progressByRequest, setProgressByRequest] = useState({});
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadAcceptedRequests = async () => {
      try {
        const { data } = await api.getOutgoingSwapRequests();
        if (cancelled) return;

        const accepted = data.filter((item) => item.status === 'accepted');
        if (accepted.length > 0) {
          setAcceptedRequests(accepted);
          const current = accepted.find((item) => item._id === requestId) || accepted[0];
          setRequest(current);
          setActiveRequestId(current?._id || null);
        } else if (location.state?.request) {
          setAcceptedRequests([location.state.request]);
          setRequest(location.state.request);
          setActiveRequestId(location.state.request._id);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (request && request.status === 'accepted') {
      setAcceptedRequests([request]);
      setActiveRequestId(request._id);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    loadAcceptedRequests();

    return () => {
      cancelled = true;
    };
  }, [location.state, request, requestId]);

  const currentRequest = acceptedRequests.find((item) => item._id === activeRequestId) || request || acceptedRequests[0];

  useEffect(() => {
    if (!activeRequestId) return;
    setProgressByRequest((prev) => ({
      ...prev,
      [activeRequestId]: prev[activeRequestId] || createProgress()
    }));
  }, [activeRequestId]);

  useEffect(() => {
    if (!currentRequest?.recipient?._id) {
      setDocuments([]);
      return;
    }

    api.getConversation(currentRequest.recipient._id)
      .then(({ data }) => {
        const sharedDocuments = data
          .filter((msg) => msg.attachment?.url)
          .map((msg) => ({
            id: msg._id,
            name: msg.attachment.name || 'Shared document.pdf',
            url: msg.attachment.url,
            sender: msg.from?.name || 'Teacher',
            createdAt: msg.timestamp || msg.createdAt
          }));
        setDocuments(sharedDocuments);
      })
      .catch(() => setDocuments([]));
  }, [currentRequest?.recipient?._id]);

  const currentProgress = currentRequest ? (progressByRequest[currentRequest._id] || createProgress()) : createProgress();
  const resources = useMemo(() => topicResources(currentRequest?.skill?.title), [currentRequest?.skill?.title]);

  const updateProgress = (changes) => {
    if (!currentRequest) return;
    setProgressByRequest((prev) => ({
      ...prev,
      [currentRequest._id]: {
        ...(prev[currentRequest._id] || createProgress()),
        ...changes
      }
    }));
  };

  const score = currentProgress.answers.reduce((total, answer, index) => total + (resources.answers[index] && answer.trim().toLowerCase().includes(resources.answers[index]) ? 1 : 0), 0);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500">Preparing your learning workspace...</div>;
  if (!currentRequest) return <div className="max-w-5xl mx-auto px-4 py-16 text-center"><p className="text-gray-600">This learning exchange could not be found.</p><button onClick={() => navigate('/profile')} className="mt-4 text-brand-700 font-semibold">Back to profile</button></div>;

  const title = currentRequest.skill?.title || 'Your skill exchange';
  const guide = { title, category: currentRequest.skill?.category || 'Skill', description: currentRequest.skill?.description, user: currentRequest.recipient, tags: ['skill exchange'], readingNotes: resources.books, roadmap: resources.assignments };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-3xl bg-gray-950 text-white p-7 sm:p-10 shadow-card mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-200 font-semibold">Learning workspace</p>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold mt-3">{title}</h1>
        <p className="text-gray-300 mt-3 max-w-2xl">Your exchange is ready. Use this workspace to study, practise, complete the assignment, and then discuss your progress with {currentRequest.recipient?.name || 'your teacher'}.</p>
        <div className="flex flex-wrap gap-3 mt-6">
          <span className="bg-emerald-400 text-gray-950 text-xs font-bold px-3 py-1.5 rounded-full">Payment confirmed</span>
          <span className="bg-white/10 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-full">Teacher: {currentRequest.recipient?.name}</span>
        </div>
      </div>

      {acceptedRequests.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {acceptedRequests.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setActiveRequestId(item._id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeRequestId === item._id ? 'bg-brand-gradient text-white shadow-glow' : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300'}`}
            >
              {item.skill?.title || 'Skill exchange'}
            </button>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
        <main className="space-y-6">
          <section className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Guide</p><h2 className="text-2xl font-display font-bold mt-1">Read before your session</h2></div>
              <button onClick={() => openSkillPdf(guide)} className="bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl">Open PDF guide</button>
            </div>
            <p className="text-sm text-gray-600 mt-4 leading-6">Start with the guide, highlight questions, and bring one practical example to your exchange.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              {resources.books.map((book) => <div key={book} className="border border-gray-100 rounded-xl p-4"><p className="font-semibold text-sm">{book}</p><p className="text-xs text-gray-500 mt-1">Suggested reference</p></div>)}
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Practice links</p>
            <h2 className="text-2xl font-display font-bold mt-1">Learn by doing</h2>
            <div className="space-y-3 mt-5">{resources.links.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:border-brand-300 hover:bg-brand-50 transition-colors"><span className="text-sm font-semibold">{label}</span><span className="text-brand-600 text-sm">Open ↗</span></a>)}</div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Assignment</p>
            <h2 className="text-2xl font-display font-bold mt-1">Your practice plan</h2>
            <div className="space-y-3 mt-5">{resources.assignments.map((assignment, index) => <label key={assignment} className="flex gap-3 items-start border border-gray-100 rounded-xl p-4 cursor-pointer"><input type="checkbox" checked={currentProgress.checked.includes(index)} onChange={() => updateProgress({ checked: currentProgress.checked.includes(index) ? currentProgress.checked.filter((item) => item !== index) : [...currentProgress.checked, index] })} className="mt-1 accent-brand-600" /><span className="text-sm text-gray-700">{assignment}</span></label>)}</div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Knowledge check</p>
            <h2 className="text-xl font-display font-bold mt-1">Test your understanding</h2>
            <div className="space-y-4 mt-5">{resources.questions.map((question, index) => <div key={question}><label className="text-sm font-semibold text-gray-700">{index + 1}. {question}</label><input value={currentProgress.answers[index] || ''} onChange={(event) => updateProgress({ answers: currentProgress.answers.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Your answer" /></div>)}</div>
            <button onClick={() => updateProgress({ submitted: true })} className="w-full mt-5 bg-gray-950 text-white font-semibold py-2.5 rounded-xl">Check answers</button>
            {currentProgress.submitted && <p className="text-sm text-brand-700 font-semibold mt-3">Score: {score}/{resources.questions.length}. Review the guide and try again, then discuss your questions with your teacher.</p>}
          </section>
          <section className="bg-brand-50 border border-brand-100 rounded-2xl p-6"><p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Ready to talk?</p><h2 className="text-xl font-display font-bold mt-1">Share your progress</h2><p className="text-sm text-gray-600 mt-2 leading-6">Bring your completed assignment and questions to the conversation.</p><button onClick={() => navigate(`/messages/${currentRequest.recipient?._id}`)} className="w-full mt-5 bg-brand-gradient text-white font-semibold py-2.5 rounded-xl">Open conversation</button></section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Documents</p>
            <h2 className="text-xl font-display font-bold mt-1">Shared study materials</h2>

            {documents.length === 0 ? (
              <p className="text-sm text-gray-500 mt-4">No PDFs have been shared in this exchange yet.</p>
            ) : (
              <div className="space-y-3 mt-5">
                {documents.map((doc) => (
                  <div key={doc.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Shared by {doc.sender}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
                          className="text-xs font-semibold text-brand-700"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadAttachment(doc)}
                          className="text-xs font-semibold text-gray-700"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default LearningWorkspace;
