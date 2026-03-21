import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <span className={`text-xl font-black ${color || 'text-white'}`}>{value ?? '—'}</span>
      <span className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/[0.04] last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <span className="text-violet-400">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm text-gray-200 font-medium truncate mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

const actionCards = [
  {
    to: '/update-account',
    label: 'Update Account',
    desc: 'Change username or email',
    gradient: 'from-violet-600 to-indigo-600',
    shadow: 'rgba(109,40,217,0.5)',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    to: '/change-password',
    label: 'Change Password',
    desc: 'Update your security',
    gradient: 'from-pink-600 to-rose-600',
    shadow: 'rgba(225,29,72,0.4)',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#080810]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 animate-slide-up">
        {/* Profile Hero */}
        <div className="card relative overflow-hidden mb-6 p-0">
          {/* Top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)' }} />

          {/* Cover */}
          <div className="relative h-44 overflow-hidden rounded-t-3xl">
            {user?.coverImage ? (
              <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full"
                style={{
                  background: 'linear-gradient(135deg, #1e0a3c 0%, #0f1442 40%, #071a3e 100%)'
                }}>
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 50%, rgba(139,92,246,0.4) 0%, transparent 50%),
                                      radial-gradient(circle at 75% 30%, rgba(79,70,229,0.4) 0%, transparent 50%)`
                  }} />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.95) 0%, rgba(8,8,16,0.2) 60%, transparent 100%)' }} />
          </div>

          {/* Avatar + Name */}
          <div className="px-8 pb-6">
            <div className="relative -mt-14 mb-5 flex items-end justify-between">
              <div className="relative">
                <img src={user?.avatar} alt="avatar"
                  className="w-24 h-24 rounded-2xl object-cover"
                  style={{
                    boxShadow: '0 0 0 4px #080810, 0 0 0 6px rgba(139,92,246,0.4), 0 16px 48px rgba(139,92,246,0.3)'
                  }} />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-2 border-[#080810]
                                flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="badge mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active
              </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">{user?.fullName}</h2>
            <p className="text-gray-500 text-sm mt-0.5 font-medium">@{user?.username}</p>
            <p className="text-gray-600 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Account info card */}
          <div className="card">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Account Info</h3>
            <InfoRow
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              label="Full Name"
              value={user?.fullName}
            />
            <InfoRow
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              label="Username"
              value={`@${user?.username}`}
            />
            <InfoRow
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              label="Email"
              value={user?.email}
            />
          </div>

          {/* Quick actions */}
          <div className="flex flex-col gap-4">
            {actionCards.map(({ to, label, desc, gradient, shadow, icon }) => (
              <Link key={to} to={to}
                className={`card-inner flex items-center gap-4 group hover:scale-[1.02] transition-all duration-200`}
                style={{ textDecoration: 'none' }}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg transition-transform duration-200 group-hover:scale-110`}
                  style={{ boxShadow: `0 8px 24px ${shadow}` }}>
                  <span className="text-white">{icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-600 ml-auto group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-200 shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
