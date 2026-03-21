import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navLinks = [
  {
    to: '/dashboard', label: 'Profile',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  },
  {
    to: '/update-account', label: 'Account',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
  },
  {
    to: '/change-password', label: 'Security',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="sticky top-0 z-50" style={{
      background: 'rgba(8,8,16,0.8)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-lg font-black gradient-text tracking-tight">UserHub</span>
        </Link>

        {/* Nav */}
        {user && (
          <div className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ to, label, icon }) => {
              const active = pathname === to;
              return (
                <Link key={to} to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                  style={active ? {
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))',
                    boxShadow: '0 0 0 1px rgba(139,92,246,0.3)',
                    color: '#a78bfa',
                  } : {}}>
                  {icon}
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* User area */}
        {user && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-gray-300">{user.fullName}</p>
              <p className="text-[10px] text-gray-600">@{user.username}</p>
            </div>
            <div className="relative">
              <img src={user.avatar} alt="avatar"
                className="w-9 h-9 rounded-xl object-cover"
                style={{ boxShadow: '0 0 0 2px rgba(139,92,246,0.5)' }} />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#080810]" />
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-400 transition-all duration-200 hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
