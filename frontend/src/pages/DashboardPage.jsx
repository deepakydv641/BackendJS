import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
      <span className={`text-xl font-bold ${color || 'text-gray-900 dark:text-white'}`}>{value ?? '—'}</span>
      <span className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-zinc-800/50 last:border-0">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
        <span className="w-5 h-5">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm text-gray-900 dark:text-zinc-100 font-medium truncate mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

const actionCards = [
  {
    to: '/update-account',
    label: 'Update Account',
    desc: 'Change username or email',
    color: 'bg-blue-600',
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
    color: 'bg-indigo-600',
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 animate-slide-up">
        {/* Profile Hero */}
        <div className="card relative overflow-hidden mb-6 p-0 border-0">
          {/* Cover */}
          <div className="relative h-44 overflow-hidden rounded-t-xl bg-gray-200 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-800/50">
            {user?.coverImage ? (
              <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-600/10 dark:bg-blue-500/5 flex items-center justify-center">
                <span className="text-blue-500/20 dark:text-blue-500/10 font-bold text-4xl tracking-widest">COVER PROFILE</span>
              </div>
            )}
          </div>

          {/* Avatar + Name */}
          <div className="px-8 pb-6 border-x border-b border-gray-200 dark:border-zinc-800/50 rounded-b-xl bg-white dark:bg-[#121214]">
            <div className="relative -mt-12 mb-4 flex items-end justify-between">
              <div className="relative">
                <img src={user?.avatar} alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#121214] shadow-md bg-gray-100 dark:bg-zinc-800"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#121214]" />
              </div>
              <div className="badge mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{user?.fullName}</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-0.5 font-medium">@{user?.username}</p>
            <p className="text-gray-600 dark:text-zinc-500 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Account info card */}
          <div className="card">
            <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Account Info</h3>
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
            {actionCards.map(({ to, label, desc, color, icon }) => (
              <Link key={to} to={to}
                className={`card-inner flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-200`}
                style={{ textDecoration: 'none' }}>
                <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                  <span className="text-white">{icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 dark:text-zinc-600 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 shrink-0"
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
