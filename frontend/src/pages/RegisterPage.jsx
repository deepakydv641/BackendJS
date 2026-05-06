import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
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

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#4a5568' }}>
      {children}
    </label>
  );
}

function StyledInput({ onFocus, onBlur, ...props }) {
  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--accent-primary, #7c3aed)';
    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)';
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    if (onBlur) onBlur(e);
  };
  return (
    <input
      {...props}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
      style={{ background: '#fff', border: '1.5px solid #e2e8f0', color: '#1a1a2e', ...props.style }}
    />
  );
}

function AvatarUpload({ preview, onFile }) {
  return (
    <label
      htmlFor="avatarInput"
      className="cursor-pointer flex flex-col items-center justify-center rounded-2xl transition-all duration-200 relative overflow-hidden"
      style={{
        height: 110,
        border: preview ? '2px solid var(--accent-primary, #7c3aed)' : '2px dashed #cbd5e0',
        background: preview ? 'rgba(124,58,237,0.04)' : '#f7fafc',
      }}
    >
      {preview ? (
        <>
          <img src={preview} alt="avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold">Change</span>
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(124,58,237,0.10)' }}>
            <svg className="w-5 h-5" style={{ color: '#7c3aed' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-xs font-medium" style={{ color: '#7c3aed' }}>Upload Avatar</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#a0aec0' }}>Required</p>
        </>
      )}
      <input id="avatarInput" type="file" accept="image/*" className="sr-only"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </label>
  );
}

function CoverUpload({ preview, onFile }) {
  return (
    <label
      htmlFor="coverInput"
      className="cursor-pointer flex flex-col items-center justify-center rounded-2xl transition-all duration-200 relative overflow-hidden"
      style={{
        height: 110,
        border: preview ? '2px solid #10b981' : '2px dashed #cbd5e0',
        background: preview ? 'rgba(16,185,129,0.04)' : '#f7fafc',
      }}
    >
      {preview ? (
        <>
          <img src={preview} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold">Change</span>
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(16,185,129,0.10)' }}>
            <svg className="w-5 h-5" style={{ color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-medium" style={{ color: '#10b981' }}>Cover Image</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#a0aec0' }}>Optional</p>
        </>
      )}
      <input id="coverInput" type="file" accept="image/*" className="sr-only"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </label>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleAvatarFile = (f) => { setAvatar(f); setAvatarPreview(URL.createObjectURL(f)); };
  const handleCoverFile = (f) => { setCoverImage(f); setCoverPreview(URL.createObjectURL(f)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return toast.error('Profile photo is required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('avatar', avatar);
      if (coverImage) fd.append('coverImage', coverImage);
      await api.post('/register', fd);
      toast.success('Account created! Please sign in 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Outfit','Inter',sans-serif" }}>

      {/* ── Left Panel: Dark Teal ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-2/5 relative overflow-hidden p-12"
        style={{ background: '#11312f' }}
      >
        {/* Glow accents */}
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl"
            style={{ background: 'var(--accent-primary, #7c3aed)' }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Join VidStream</h2>
          <p className="text-white/60 text-base leading-relaxed max-w-xs">
            Create your account and start your content journey today.
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-col gap-3">
            {['🎬 Upload unlimited videos', '🌍 Reach a global audience', '💬 Engage your community'].map(f => (
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto" style={{ background: '#f8fffe' }}>
        <div className="w-full max-w-lg animate-slide-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-primary, #7c3aed)' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#11312f' }}>VidStream</span>
          </div>

          <h1 className="text-3xl font-bold mb-1" style={{ color: '#1a1a2e' }}>Create Account</h1>
          <p className="text-sm mb-6" style={{ color: '#718096' }}>Join the VidStream community</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Avatar + Cover uploads */}
            <div>
              <FieldLabel>Profile Images</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <AvatarUpload preview={avatarPreview} onFile={handleAvatarFile} />
                <CoverUpload preview={coverPreview} onFile={handleCoverFile} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: '#e2e8f0' }} />

            {/* Full Name + Username */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <StyledInput
                  name="fullName" value={form.fullName} onChange={handleChange}
                  placeholder="John Doe" required disabled={loading}
                />
              </div>
              <div>
                <FieldLabel>Username</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold select-none" style={{ color: '#7c3aed' }}>@</span>
                  <StyledInput
                    name="username" value={form.username} onChange={handleChange}
                    placeholder="johndoe" required disabled={loading}
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <StyledInput
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <StyledInput
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 6 characters"
                  required disabled={loading}
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: '#a0aec0' }}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-1"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'none'; }}
            >
              {loading
                ? <><Spinner size="sm" /><span>Creating account…</span></>
                : <><span>Create Account</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs" style={{ color: '#a0aec0' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          <p className="text-center text-sm" style={{ color: '#718096' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: 'var(--accent-primary, #7c3aed)' }}>
              Sign in →
            </Link>
          </p>
          <p className="text-center text-xs mt-3" style={{ color: '#a0aec0' }}>
            By creating an account you accept our{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--accent-primary, #7c3aed)' }}>Terms of service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
