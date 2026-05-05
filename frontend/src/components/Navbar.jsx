import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const navLinks = [
  {
    to: '/home', label: 'Home',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/dashboard', label: 'Profile',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

// Highlights the matching query portion inside a suggestion title
function highlightMatch(title, query) {
  if (!query.trim()) return title;
  const idx = title.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <strong style={{ color: '#c084fc', fontWeight: 600 }}>{title.slice(idx, idx + query.length)}</strong>
      {title.slice(idx + query.length)}
    </>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // ── Debounced autocomplete fetch ────────────────────────────────────
  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    setLoadingSuggestions(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(
        `\${import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://vidstream-th0g.onrender.com'}/api/v1/search/search?q=${encodeURIComponent(q)}`,
        { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const hits = Array.isArray(res.data) ? res.data : [];
      // Extract unique titles (up to 7)
      const titles = [...new Set(hits.map(v => v.title))].slice(0, 7);
      setSuggestions(titles);
      setShowSuggestions(titles.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const commitSearch = (term) => {
    const q = (term ?? searchQuery).trim();
    if (!q) return;
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setSearchQuery('');
    navigate(`/search/${encodeURIComponent(q)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    commitSearch();
  };

  // Keyboard navigation inside the suggestions dropdown
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      commitSearch(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  // ── Scroll listener ─────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Click-outside: close user menu + suggestions dropdown ───────────
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('See you again! 👋');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(8, 8, 26, 0.85)'
          : 'rgba(8, 8, 26, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              boxShadow: '0 0 16px rgba(124,58,237,0.5)'
            }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            VidStream
          </span>
        </Link>

        {/* Center Nav Links & Search */}
        {user && (
          <div className="hidden sm:flex flex-1 items-center justify-center gap-4 max-w-xl mx-4">
            {/* Search wrapper — relative so dropdown positions correctly */}
            <div className="relative w-full max-w-md" ref={searchRef}>
              <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full p-1 w-full transition-all duration-200"
                style={showSuggestions ? { borderColor: 'rgba(168,85,247,0.40)', boxShadow: '0 0 0 3px rgba(168,85,247,0.10)' } : {}}
              >
                <form onSubmit={handleSearch} className="flex-1 flex items-center bg-transparent px-3">
                  {loadingSuggestions ? (
                    <svg className="w-4 h-4 text-violet-400 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  <input
                    id="navbar-search-input"
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    autoComplete="off"
                    className="w-full bg-transparent border-none text-sm text-white placeholder-white/40 focus:outline-none focus:ring-0 px-3 py-1.5"
                  />
                  <button type="submit" className="sr-only">Search</button>
                </form>
              </div>

              {/* ── Autocomplete Dropdown ── */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 animate-scale-in"
                  style={{
                    background: 'rgba(22,17,43,0.97)',
                    border: '1px solid rgba(168,85,247,0.20)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(168,85,247,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <ul role="listbox" className="py-1.5">
                    {suggestions.map((title, idx) => (
                      <li
                        key={idx}
                        role="option"
                        aria-selected={idx === activeIndex}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseLeave={() => setActiveIndex(-1)}
                        onMouseDown={(e) => { e.preventDefault(); commitSearch(title); }}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100"
                        style={{
                          background: idx === activeIndex ? 'rgba(168,85,247,0.14)' : 'transparent',
                          color: idx === activeIndex ? '#e9d5ff' : '#94a3b8',
                        }}
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-sm truncate">{highlightMatch(title, searchQuery)}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="px-4 py-2 border-t text-xs flex items-center gap-1.5"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                  >
                    <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>↑↓</kbd>
                    navigate &nbsp;
                    <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>↵</kbd>
                    select &nbsp;
                    <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>Esc</kbd>
                    close
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {navLinks.map(({ to, label, icon }) => {
                const active = pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`nav-link ${active ? 'active' : ''}`}
                    title={label}
                  >
                    {icon}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Upload CTA */}
              <Link
                to="/upload-video"
                className="hidden sm:flex items-center gap-2 btn-primary py-2 px-4 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Upload
              </Link>

              {/* User Avatar + Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl transition-all duration-200 hover:bg-white/[0.06] group"
                >
                  <div
                    className="w-9 h-9 rounded-xl overflow-hidden border-2 transition-all duration-200"
                    style={{ borderColor: menuOpen ? 'rgba(124,58,237,0.7)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 hidden sm:block`}
                    style={{ color: 'var(--text-muted)', transform: menuOpen ? 'rotate(180deg)' : 'none' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 animate-scale-in"
                    style={{
                      background: 'var(--surface-3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)',
                    }}
                  >
                    <div className="p-3 border-b border-white/[0.06]">
                      <p className="text-sm font-semibold text-white/90 truncate">{user.fullName}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>@{user.username}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-white/[0.06] group"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <svg className="w-4 h-4 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/upload-video"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-white/[0.06] group"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <svg className="w-4 h-4 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Video
                      </Link>
                      <Link
                        to="/liked-videos"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-white/[0.06] group"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <svg className="w-4 h-4 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Liked Videos
                      </Link>
                      <Link
                        to="/change-password"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-white/[0.06] group"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <svg className="w-4 h-4 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Security
                      </Link>

                      <div className="h-px my-1.5 mx-2" style={{ background: 'rgba(255,255,255,0.06)' }} />

                      <button
                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-red-500/10 group"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <svg className="w-4 h-4 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="group-hover:text-red-400 transition-colors">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-5 text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav pills */}
      {user && (
        <div className="sm:hidden flex items-center gap-1 px-4 pb-2">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className={`nav-link flex-1 justify-center text-xs ${pathname === to ? 'active' : ''}`}>
              {icon}
              {label}
            </Link>
          ))}
          <Link to="/upload-video" className="nav-link flex-1 justify-center text-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload
          </Link>
        </div>
      )}
    </nav>
  );
}
