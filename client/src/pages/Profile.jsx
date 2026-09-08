import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/services';
import { useAuth } from '../context/AuthContext';
import TagInput from '../components/TagInput';

const Profile = () => {
  const { user, updateLocalUser } = useAuth();
  const navigate = useNavigate();
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [resolvingId, setResolvingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const loadSwapRequests = async () => {
    const [{ data: incoming }, { data: outgoing }] = await Promise.all([
      api.getIncomingSwapRequests(),
      api.getOutgoingSwapRequests()
    ]);
    setIncomingRequests(incoming);
    setOutgoingRequests(outgoing);
  };

  useEffect(() => {
    (async () => {
      const { data } = await api.getProfile();
      setSkillsToTeach(data.skillsToTeach || []);
      setSkillsToLearn(data.skillsToLearn || []);
      const mine = await api.getMySkills();
      setMySkills(mine.data);
      await loadSwapRequests();
    })();
  }, []);

  const saveSkills = async () => {
    setSaving(true);
    try {
      const { data } = await api.updateProfile({ skillsToTeach, skillsToLearn });
      updateLocalUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const removeMySkill = async (id) => {
    await api.deleteSkill(id);
    setMySkills((prev) => prev.filter((s) => s._id !== id));
  };

  const respondToSwap = async (requestId, status) => {
    setResolvingId(requestId);
    try {
      const { data } = await api.updateSwapRequest(requestId, status);
      setIncomingRequests((previous) => previous.map((request) => (
        request._id === data._id ? data : request
      )));
    } finally {
      setResolvingId(null);
    }
  };

  const payForSwap = async (requestId) => {
    setPayingId(requestId);
    try {
      const { data } = await api.paySwapRequest(requestId);
      setOutgoingRequests((previous) => previous.map((request) => (
        request._id === data._id ? data : request
      )));
    } catch (err) {
      window.alert(err.response?.data?.msg || 'Unable to confirm payment. Please try again.');
    } finally {
      setPayingId(null);
    }
  };

  const pendingIncoming = incomingRequests.filter((request) => request.status === 'pending');
  const acceptedOutgoing = outgoingRequests.filter((request) => request.status === 'accepted');
  const hasExchangeOffer = skillsToTeach.length > 0 || skillsToLearn.length > 0 || mySkills.length > 0;

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8 animate-fadeUp">
        <h1 className="text-3xl font-display font-extrabold mb-1">My Profile</h1>
        <p className="text-gray-500">Manage what you teach, what you want to learn, and your posts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xl font-semibold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 text-white rounded-2xl shadow-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200 font-semibold">Your guidance path</p>
            <h2 className="text-2xl font-display font-bold mt-2">From first hello to shared progress</h2>
          </div>
          <p className="text-sm text-gray-400 max-w-sm">Follow a simple path so every exchange has a clear next step.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { number: '01', title: 'Define', text: 'Add what you teach or want to learn.', done: hasExchangeOffer, action: () => document.getElementById('skill-preferences')?.scrollIntoView({ behavior: 'smooth' }) },
            { number: '02', title: 'Discover', text: 'Find a person with a compatible goal.', done: outgoingRequests.length > 0, action: () => navigate('/browse') },
            { number: '03', title: 'Exchange', text: 'Accept a request and start talking.', done: acceptedOutgoing.length > 0 || incomingRequests.some((request) => request.status === 'accepted'), action: () => navigate('/messages') },
            { number: '04', title: 'Reflect', text: 'Share what worked and keep learning.', done: false, action: () => navigate('/messages') }
          ].map((step) => (
            <button key={step.number} onClick={step.action} className="text-left border border-white/15 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.done ? 'bg-emerald-400 text-gray-950' : 'bg-white/10 text-brand-100'}`}>
                {step.done ? '✓' : step.number}
              </div>
              <p className="font-semibold mt-4">{step.title}</p>
              <p className="text-xs text-gray-400 mt-1 leading-5">{step.text}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Incoming</p>
            <h2 className="font-display font-bold text-xl mt-1">Swap requests for your skills</h2>
          </div>
          <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full">{pendingIncoming.length} awaiting response</span>
        </div>
        {incomingRequests.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No requests yet. Keep your skill offers clear and discoverable.</p>
        ) : (
          <div className="space-y-3">
            {incomingRequests.map((request) => (
              <div key={request._id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">{request.requester?.name} wants to exchange around “{request.skill?.title}”</p>
                  <p className="text-xs font-semibold text-brand-700 mt-1">{request.skill?.amount > 0 ? `Teaching amount: INR ${request.skill.amount} per session` : 'Free skill exchange'}</p>
                  <p className="text-xs text-gray-500 mt-1">{request.note}</p>
                  <span className={`inline-flex mt-2 text-xs font-semibold px-2 py-1 rounded-full ${request.status === 'pending' ? 'bg-amber-50 text-amber-700' : request.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{request.status}</span>
                </div>
                {request.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button disabled={resolvingId === request._id} onClick={() => respondToSwap(request._id, 'accepted')} className="bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50">Accept</button>
                    <button disabled={resolvingId === request._id} onClick={() => respondToSwap(request._id, 'rejected')} className="border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg hover:border-red-300 hover:text-red-600 disabled:opacity-50">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold">Your learning payments</p>
        <h2 className="font-display font-bold text-xl mt-1 mb-4">Accepted exchanges</h2>
        {outgoingRequests.filter((request) => request.status === 'accepted').length === 0 ? (
          <p className="text-sm text-gray-400">Accepted learning exchanges will appear here.</p>
        ) : (
          <div className="space-y-3">
            {outgoingRequests.filter((request) => request.status === 'accepted').map((request) => (
              <div key={request._id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{request.skill?.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Teacher: {request.recipient?.name}</p>
                  <p className="text-xs font-semibold text-brand-700 mt-1">{request.skill?.amount > 0 ? `INR ${request.skill.amount} per session` : 'Free skill exchange'}</p>
                </div>
                {request.paymentStatus === 'paid' || request.skill?.amount === 0 ? (
                  <button onClick={() => navigate(`/learning/${request._id}`, { state: { request } })} className="bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-emerald-700">Start learning</button>
                ) : request.skill?.amount > 0 ? (
                  <button disabled={payingId === request._id} onClick={() => payForSwap(request._id)} className="bg-brand-gradient text-white text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50">
                    {payingId === request._id ? 'Confirming...' : `Pay INR ${request.skill.amount}`}
                  </button>
                ) : (
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-2 rounded-lg">No payment needed</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="skill-preferences" className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🎓 Skills I can teach</label>
            <TagInput tags={skillsToTeach} onChange={setSkillsToTeach} placeholder="e.g. Python, Guitar..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📚 Skills I want to learn</label>
            <TagInput tags={skillsToLearn} onChange={setSkillsToLearn} placeholder="e.g. Spanish, Photography..." color="accent" />
          </div>

          <button
            onClick={saveSkills}
            disabled={saving}
            className="w-full bg-brand-gradient text-white font-semibold py-2.5 rounded-xl shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h2 className="font-display font-bold text-lg mb-4">My posted skills</h2>
        {mySkills.length === 0 ? (
          <p className="text-sm text-gray-400">You haven't posted any skills yet.</p>
        ) : (
          <div className="space-y-2">
            {mySkills.map((skill) => (
              <div key={skill._id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium">{skill.title}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      skill.category === 'teach' ? 'bg-brand-50 text-brand-700' : 'bg-accent-500/10 text-accent-600'
                    }`}
                  >
                    {skill.category === 'teach' ? 'Teaching' : 'Wants to learn'}
                  </span>
                </div>
                <button
                  onClick={() => removeMySkill(skill._id)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
