import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  const navLinks = [
    {
      to: '/home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      to: '/dashboard',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      to: '/liked-videos',
      label: 'Liked Videos',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      to: '/history',
      label: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      to: '/change-password',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 overflow-y-auto" style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="p-6 pb-8">
        <Link to="/home" className="flex items-center gap-3 shrink-0 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VidStream</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navLinks.map((link) => {
          const isHistoryLink = link.label === 'History';
          const isHomeLink = link.label === 'Home';

          let active = false;
          if (isHistoryLink) {
            // Active only when on /home AND state.tab === 'history'
            active = pathname === '/home' && location.state?.tab === 'history';
          } else if (isHomeLink) {
            // Active when on /home but NOT in history state
            active = pathname === '/home' && location.state?.tab !== 'history';
          } else {
            active = pathname.startsWith(link.to);
          }

          return (
            <Link
              key={link.label}
              to={link.to}
              state={link.navState}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              style={{ background: active ? 'var(--sidebar-active)' : 'transparent' }}
            >
              <div className={active ? 'text-white' : 'text-white/60'}>
                {link.icon}
              </div>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 text-xs text-white/30 transition-all duration-300 hover:scale-105 hover:text-white/50">
        <p>© {new Date().getFullYear()} VidStream</p>
      </div>
    </div>
  );
}
