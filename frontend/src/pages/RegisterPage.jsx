import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

function ImageUploadZone({ id, label, required, preview, onFile, aspect, innerEl }) {
  return (
    <div>
      <label className="form-label">{label} {required && <span style={{ color: '#f87171', textTransform: 'none', letterSpacing: 'normal' }}>*</span>}</label>
      <label
        htmlFor={id}
        className="block cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          border: `2px dashed ${preview ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`,
          background: preview ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)',
          boxShadow: preview ? '0 0 20px rgba(124,58,237,0.15)' : 'none',
          aspectRatio: aspect,
        }}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-white text-xs font-semibold">Change Image</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 h-full min-h-[120px]">
            {innerEl}
          </div>
        )}
        <input id={id} type="file" accept="image/*" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      </label>
    </div>
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

  const handleAvatarFile = (file) => { setAvatar(file); setAvatarPreview(URL.createObjectURL(file)); };
  const handleCoverFile = (file) => { setCoverImage(file); setCoverPreview(URL.createObjectURL(file)); };

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
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: 'var(--surface-1)' }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-slide-up">
        {/* Branding */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Join the VidStream community
          </p>
        </div>

        <div className="glass-card">
          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)' }} />

          {/* Image Uploads */}
          <div className="mb-5">
            <p className="form-label mb-3">Profile Images</p>
            <div className="grid grid-cols-2 gap-4">
              <ImageUploadZone
                id="avatarInput" label="Profile Photo" required aspect="1/1"
                preview={avatarPreview} onFile={handleAvatarFile}
                innerEl={<>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                    <svg className="w-5 h-5" style={{ color: '#a78bfa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>Upload Avatar</p>
                </>}
              />
              <ImageUploadZone
                id="coverInput" label="Cover Image" aspect="16/9"
                preview={coverPreview} onFile={handleCoverFile}
                innerEl={<>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)' }}>
                    <svg className="w-5 h-5" style={{ color: '#818cf8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>Cover Image</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>optional</p>
                </>}
              />
            </div>
          </div>

          <div className="my-5 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange}
                  placeholder="John Doe" className="input-field" required disabled={loading} />
              </div>
              <div>
                <label className="form-label">Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: '#7c3aed' }}>@</span>
                  <input name="username" value={form.username} onChange={handleChange}
                    placeholder="johndoe" className="input-field pl-8" required disabled={loading} />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-field pl-10" required disabled={loading} />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-11" required disabled={loading} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><Spinner size="sm" /><span>Creating account…</span></>
                : <><span>Create Account</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              }
            </button>
          </form>

          <div className="mt-5 pt-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#a78bfa' }}>Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
