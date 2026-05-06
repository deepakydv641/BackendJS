import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [useEmail, setUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { password: form.password };
      if (useEmail) payload.email = form.email;
      else payload.username = form.username;
      await login(payload);
      toast.success('Welcome back! 🎉');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>

      {/* ── Left Panel: Dark Teal Branding ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-2/5 relative overflow-hidden p-12"
        style={{ background: '#11312f' }}
      >
        {/* Subtle glow blob */}
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

        <div className="relative z-10 text-center">
          {/* Logo icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl"
            style={{ background: 'var(--accent-primary, #7c3aed)' }}
          >
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome back</h2>
          <p className="text-white/60 text-base leading-relaxed max-w-xs">
            Sign in to continue your streaming journey on VidStream.
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-col gap-3">
            {['🎬 Unlimited streaming', '📥 Download videos', '🔔 Creator subscriptions'].map(f => (
              <div
                key={f}
                className="flex items-center gap-3 rounded-full px-5 py-2.5"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <span className="text-sm text-white/80 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12" style={{ background: '#f8fffe' }}>
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#11312f' }}>VidStream</span>
          </div>

          <h1 className="text-3xl font-bold mb-1" style={{ color: '#1a1a2e' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: '#718096' }}>Sign in to continue to VidStream</p>

          {/* Toggle: Email / Username */}
          <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: '#edf2f7' }}>
            {['Email', 'Username'].map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setUseEmail(i === 0)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={
                  (i === 0) === useEmail
                    ? { background: '#fff', color: 'var(--accent-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                    : { color: '#718096' }
                }
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#4a5568' }}>
                {useEmail ? 'Email Address' : 'Username'}
              </label>
              <input
                type={useEmail ? 'email' : 'text'}
                name={useEmail ? 'email' : 'username'}
                value={useEmail ? form.email : form.username}
                onChange={handleChange}
                placeholder={useEmail ? 'you@example.com' : 'your_username'}
                required
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: '#fff',
                  border: '1.5px solid #e2e8f0',
                  color: '#1a1a2e',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#4a5568' }}>
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-medium transition-colors" style={{ color: 'var(--accent-primary)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all duration-200"
                  style={{ background: '#fff', border: '1.5px solid #e2e8f0', color: '#1a1a2e' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: '#a0aec0' }}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-2"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'none'; }}
            >
              {loading
                ? <><Spinner size="sm" /><span>Signing in…</span></>
                : <><span>Sign In</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs" style={{ color: '#a0aec0' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          <p className="text-center text-sm" style={{ color: '#718096' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--accent-primary)' }}>
              Create one →
            </Link>
          </p>
          <p className="text-center text-xs mt-4" style={{ color: '#a0aec0' }}>
            By signing in you accept our{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--accent-primary)' }}>Terms of service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
