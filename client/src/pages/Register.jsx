import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/browse" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050817] px-4 py-12 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#10182a] p-8 shadow-2xl shadow-black/20 animate-fadeUp">
        <div className="flex items-center gap-2 text-xl font-display font-extrabold text-white mb-8">
          <span className="w-8 h-8 rounded-lg border border-[#19d3a2]/30 bg-[#0d2d32] text-[#19d3a2] flex items-center justify-center text-sm">⇄</span>
          SkillSwap
        </div>

        <h1 className="text-2xl font-display font-bold mb-1">Create your account</h1>
        <p className="text-slate-300 text-sm mb-6">Join a community trading skills, not money.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-white/10 bg-[#050817] text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#19d3a2] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-white/10 bg-[#050817] text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#19d3a2] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
            <input
              required
              minLength={6}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-white/10 bg-[#050817] text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#19d3a2] focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-[#08a77e] text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#08a77e]/20 hover:bg-[#19c592] transition-all disabled:opacity-50"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#42e0b7] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
