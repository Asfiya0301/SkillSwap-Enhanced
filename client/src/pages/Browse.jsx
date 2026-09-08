import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as api from '../api/services';
import { useAuth } from '../context/AuthContext';
import { downloadSkillPdf } from '../utils/skillPdf';

const Browse = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserId = user ? String(user.id || user._id) : null;

  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [swapRequests, setSwapRequests] = useState({});
  const [guidance, setGuidance] = useState('');

  const fetchSkills = async (p = 1, filters = {}) => {
    setLoading(true);
    try {
      const { data } = await api.getAllSkills({
        search: filters.search ?? (search || undefined),
        category: filters.category ?? (category || undefined),
        page: p,
        limit: 9
      });
      setSkills(data.skills);
      setPage(data.currentPage);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialSearch = location.state?.search || '';
    setSearch(initialSearch);
    setGuidance(location.state?.message || '');
    fetchSkills(1, { search: initialSearch });
    api.getOutgoingSwapRequests()
      .then(({ data }) => {
        setSwapRequests(data.reduce((requests, request) => ({
          ...requests,
          [request.skill._id]: request.status
        }), {}));
      })
      .catch(() => setSwapRequests({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSkills(1);
  };

  const startConversation = (skill) => {
    navigate(`/messages/${skill.user._id}`, { state: { skillId: skill._id, skillTitle: skill.title } });
  };

  const requestSwap = async (skill) => {
    if (swapRequests[skill._id]) return;
    try {
      await api.createSwapRequest({ skillId: skill._id });
      setSwapRequests((prev) => ({ ...prev, [skill._id]: 'pending' }));
      window.alert(`Swap request sent for "${skill.title}". The owner can now accept or reject it.`);
    } catch (err) {
      window.alert(err.response?.data?.msg || 'Unable to send the swap request. Please try again.');
    }
  };

  const downloadSkillGuide = (skill) => {
    downloadSkillPdf(skill);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 animate-fadeUp rounded-3xl bg-gray-950 px-6 py-8 sm:px-10 sm:py-10 text-white shadow-card overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-brand-gradient opacity-20" />
        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-200 font-semibold mb-3">Learn together. Share what you know.</p>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-3">Find your next skill exchange</h1>
          <p className="text-gray-300 leading-7">Meet people who can help you grow, offer your own experience, and start a thoughtful conversation around the skills that matter to you.</p>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-8 bg-white p-3 rounded-2xl shadow-card border border-gray-100"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a skill, topic, or conversation..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="">All exchanges</option>
          <option value="teach">Can teach</option>
          <option value="learn">Wants to learn</option>
        </select>
        <button
          type="submit"
          className="bg-brand-gradient text-white px-7 py-2.5 rounded-xl font-semibold shadow-glow hover:opacity-95 transition-all"
        >
          Find a match
        </button>
      </form>

      {guidance && (
        <div className="mb-8 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 text-sm text-brand-900">
          <p className="font-semibold">Your next step</p>
          <p className="mt-1 text-brand-800">{guidance} Choose a person below, review their offer, and click <strong>Request a swap</strong>. They will receive a notification and can accept or reject your request.</p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading skills...</p>
      ) : skills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-10 text-center text-gray-400">
          <p className="text-gray-700 font-semibold">No community member has posted this topic yet.</p>
          <p className="mt-2">Try a different search, browse all exchanges, or{' '}
          <button onClick={() => navigate('/post')} className="text-brand-600 font-medium hover:underline">
            post your own
          </button>
          {' '}so someone can request a swap with you.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-card hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      skill.category === 'teach' ? 'bg-brand-50 text-brand-700' : 'bg-accent-500/10 text-accent-600'
                    }`}
                  >
                    {skill.category === 'teach' ? 'Can teach' : 'Wants to learn'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(skill.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg">{skill.title}</h3>
                {skill.category === 'teach' && (
                  <p className="text-sm font-semibold text-brand-700">
                    {skill.amount > 0 ? `INR ${skill.amount} per session` : 'Free skill exchange'}
                  </p>
                )}
                {skill.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{skill.description}</p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {(skill.tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-semibold">
                    {skill.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <p className="text-sm font-medium flex-1">{skill.user?.name}</p>
                  {currentUserId && String(skill.user?._id) !== currentUserId && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => requestSwap(skill)}
                        disabled={Boolean(swapRequests[skill._id])}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                          swapRequests[skill._id] === 'accepted'
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : swapRequests[skill._id] === 'rejected'
                              ? 'bg-gray-100 text-gray-500 cursor-default'
                              : swapRequests[skill._id] === 'pending'
                                ? 'bg-amber-100 text-amber-700 cursor-default'
                                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                        }`}
                      >
                        {swapRequests[skill._id] === 'accepted'
                          ? 'Swap accepted'
                          : swapRequests[skill._id] === 'rejected'
                            ? 'Request declined'
                            : swapRequests[skill._id] === 'pending'
                              ? 'Request pending'
                              : 'Request a swap'}
                      </button>
                      <button
                        onClick={() => downloadSkillGuide(skill)}
                        className="text-xs border border-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-full hover:border-brand-400 hover:text-brand-700 transition-all"
                      >
                        View learning guide
                      </button>
                      <button
                        onClick={() => startConversation(skill)}
                        className="text-xs bg-gray-900 hover:bg-brand-gradient text-white font-semibold px-3 py-1.5 rounded-full transition-all"
                      >
                        Share thoughts
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchSkills(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    p === page ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;
