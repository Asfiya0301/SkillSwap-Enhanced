import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/services';
import TagInput from '../components/TagInput';

const PostSkill = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'teach', amount: '', tags: [] });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.createSkill(form);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.msg || 'Failed to post skill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-6 animate-fadeUp">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-600 font-semibold mb-2">Start an exchange</p>
        <h1 className="text-3xl font-display font-extrabold mb-1">Bring your knowledge to the community</h1>
        <p className="text-gray-500">Offer a skill, name a learning goal, and give people a clear reason to start a helpful conversation with you.</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What would you like to exchange?</label>
          <div className="flex gap-2">
            {['teach', 'learn'].map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, category: c })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  form.category === c
                    ? 'bg-brand-gradient text-white border-transparent shadow-glow'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
                }`}
              >
                {c === 'teach' ? 'I can teach this' : 'I want to learn this'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Guitar basics for beginners"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Share your experience, what you can help with, or what you hope to learn..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        {form.category === 'teach' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teaching amount (INR)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 500 per session, or 0 for free exchange"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <p className="text-xs text-gray-400 mt-1">This displays your requested amount. Payment processing is not connected yet.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} placeholder="e.g. music, beginner-friendly" />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          disabled={submitting}
          className="w-full bg-brand-gradient text-white font-semibold py-3 rounded-xl shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
        >
          {submitting ? 'Publishing...' : 'Publish exchange offer'}
        </button>
      </form>
    </div>
  );
};

export default PostSkill;
