import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';

const InputIcon = ({ children }) => (
  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors">{children}</span>
);

export default function UpdateAccountPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/update-account', form);
      await refreshUser();
      toast.success('Account updated successfully! ✨');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] relative">
      
      <div className="max-w-md mx-auto px-4 py-16 relative z-10 animate-slide-up">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-transform hover:scale-105"
            >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-2">Update Account</h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Update your username or email address.</p>
        </div>

        <div className="card relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative">
                <InputIcon><span className="text-sm font-bold">@</span></InputIcon>
                <input type="text" name="username" value={form.username} onChange={handleChange}
                  placeholder="new_username" className="input-field pl-11" required />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <InputIcon>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </InputIcon>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-field pl-11" required />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-ghost flex-1">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-[2] flex items-center justify-center gap-2">
                {loading ? <><Spinner /><span>Saving…</span></> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
