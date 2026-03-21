import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const InputIcon = ({ children }) => (
  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors">{children}</span>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'avatar') { setAvatar(file); setAvatarPreview(url); }
    else { setCoverImage(file); setCoverPreview(url); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return toast.error('Profile photo is required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('avatar', avatar);
      if (coverImage) fd.append('coverImage', coverImage);
      await api.post('/register', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Account created! Please log in. 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 relative bg-gray-50 dark:bg-[#09090b]">
      <div className="w-full max-w-lg relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-blue-600 shadow-sm text-white transition-transform hover:scale-105"
            >
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-2">UserHub</h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Create your free account today</p>
        </div>

        <div className="card relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }} />

          {/* ── Image Uploads ── */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-3 ml-1">Profile Images</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Avatar */}
              <div>
                <button type="button" id="avatar-btn"
                  onClick={() => document.getElementById('avatarInput').click()}
                  className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all duration-300 group ${
                    avatarPreview
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:border-blue-500'
                  }`}>
                  {avatarPreview ? (
                    <>
                      <img src={avatarPreview} alt="avatar"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500 shadow-sm" />
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">✓ Click to change</span>
                    </>
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 bg-blue-100 dark:bg-blue-500/20">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 text-center">Profile Photo</p>
                        <p className="text-[10px] text-red-500 dark:text-red-400 text-center mt-0.5">required *</p>
                      </div>
                    </>
                  )}
                </button>
                <input id="avatarInput" type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleFile(e, 'avatar')} />
              </div>

              {/* Cover */}
              <div>
                <button type="button"
                  onClick={() => document.getElementById('coverInput').click()}
                  className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all duration-300 group overflow-hidden ${
                    coverPreview
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                      : 'border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:border-indigo-500'
                  }`}>
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="cover"
                        className="w-full h-24 object-cover rounded-xl" />
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">✓ Click to change</span>
                    </>
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-indigo-100 dark:bg-indigo-500/20">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 text-center">Cover Image</p>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-400 text-center mt-0.5">optional</p>
                      </div>
                    </>
                  )}
                </button>
                <input id="coverInput" type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleFile(e, 'cover')} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800/50 mb-6" />

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <InputIcon>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </InputIcon>
                  <input name="fullName" value={form.fullName} onChange={handleChange}
                    placeholder="John Doe" className="input-field pl-11" required />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Username</label>
                <div className="relative">
                  <InputIcon><span className="text-xs font-bold">@</span></InputIcon>
                  <input name="username" value={form.username} onChange={handleChange}
                    placeholder="johndoe" className="input-field pl-11" required />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <InputIcon>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </InputIcon>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-field pl-11" required />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <InputIcon>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </InputIcon>
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min 6 characters" className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={showPassword
                        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      } />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary mt-2 w-full flex items-center justify-center gap-2">
              <span className="relative z-10 flex items-center gap-2">
                {loading ? <><Spinner /><span>Creating account…</span></> : (
                  <><span>Create Account</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800/50 text-center">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
