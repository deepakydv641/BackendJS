import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const features = [
  {
    label: '4K Streaming Quality',
    letter: 'Q',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
    desc: 'Experience ultra-crisp video playback. Our global CDN ensures zero buffering no matter where your audience is.',
  },
  {
    label: 'Thriving Community',
    letter: 'C',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    desc: 'Connect with thousands of creators. Build your audience, interact through comments, and share your favourite moments.',
  },
  {
    label: 'Instant Lightning Uploads',
    letter: 'U',
    color: '#e11d48',
    bg: 'rgba(225,29,72,0.12)',
    desc: 'Our advanced chunked uploading means you spend less time waiting and more time creating great content.',
  },
  {
    label: 'Instant Downloads',
    letter: 'D',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    desc: 'Download any video for offline viewing with one click. Keep your favourite content always available.',
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [active, setActive] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Auto-rotate cards every 3 s
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % features.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden relative"
      style={{ background: 'var(--main-bg, #cae6d5)', fontFamily: "'Outfit','Inter',sans-serif" }}
    >
      {/* ─────────── Animated background blobs ─────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="absolute rounded-full"
          style={{
            width: 520, height: 520,
            top: '-120px', left: '-120px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)',
            animation: 'blobFloat1 9s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            bottom: '-80px', right: '-80px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 70%)',
            animation: 'blobFloat2 11s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 260, height: 260,
            top: '40%', right: '8%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)',
            animation: 'blobFloat3 14s ease-in-out infinite',
          }}
        />
      </div>

      {/* ─────────── Floating particles ─────────── */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="pointer-events-none fixed rounded-full z-0"
          style={{
            width: 6 + (i % 3) * 4,
            height: 6 + (i % 3) * 4,
            left: `${10 + i * 11}%`,
            top: `${15 + (i * 17) % 65}%`,
            background: ['rgba(124,58,237,0.25)', 'rgba(16,185,129,0.25)', 'rgba(245,158,11,0.20)'][i % 3],
            animation: `particleFloat ${5 + i * 1.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, 30px) scale(1.08); }
          66%       { transform: translate(-20px, 50px) scale(0.94); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-30px, -40px) scale(1.12); }
        }
        @keyframes blobFloat3 {
          0%, 100% { transform: translate(0, 0); }
          40%       { transform: translate(20px, -25px); }
          80%       { transform: translate(-15px, 15px); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50%       { transform: translateY(-22px) rotate(180deg); opacity: 1; }
        }
        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.8) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes heroFadeUp {
          0%   { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardEntrance {
          0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotExpand {
          0%, 100% { width: 8px; }
          50%       { width: 22px; }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(124,58,237,0.30); }
          50%       { box-shadow: 0 8px 32px rgba(124,58,237,0.50); }
        }
      `}</style>

      {/* ─────────── Content (above blobs) ─────────── */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* Badge */}
        <div
          className="pt-10 flex justify-center"
          style={{
            animation: mounted ? 'badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
            opacity: 0,
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{
              background: 'rgba(255,255,255,0.60)',
              border: '1px solid rgba(0,0,0,0.07)',
              color: '#11312f',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Welcome to the future of streaming
          </div>
        </div>

        {/* Hero heading — two lines, each staggered */}
        <div className="text-center mt-8 px-4">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
            style={{
              color: '#0d1f1c',
              animation: mounted ? 'heroFadeUp 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
              opacity: 0,
            }}
          >
            Unleash your creativity
          </h1>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mt-1"
            style={{
              animation: mounted ? 'heroFadeUp 0.8s 0.32s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
              opacity: 0,
            }}
          >
            with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              VidStream
            </span>
          </h1>
        </div>

        {/* Feature Cards */}
        <div
          className="relative mt-14 flex items-center justify-center px-4"
          style={{
            animation: mounted ? 'heroFadeUp 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
            opacity: 0,
          }}
        >
          <div className="relative flex items-center justify-center w-full max-w-5xl gap-3">
            {features.map((f, i) => {
              const offset = ((i - active) + features.length) % features.length;
              // 0 = active focal, 1 = right, 3 = left (wrap-around), 2 = far-right hidden
              const isFocal  = offset === 0;
              const isLeft   = offset === features.length - 1; // e.g. 3
              const isRight  = offset === 1;
              const isHidden = offset === 2;

              const scale   = isFocal ? 1 : isLeft || isRight ? 0.87 : 0.76;
              const opacity = isFocal ? 1 : isLeft || isRight ? 0.70 : 0.35;
              const zIndex  = isFocal ? 10 : isLeft || isRight ? 5 : 1;
              const rotateY = isLeft ? '-8deg' : isRight ? '8deg' : '0deg';
              const translateX = isLeft ? '20px' : isRight ? '-20px' : isHidden ? '-55px' : '0';

              return (
                <div
                  key={f.label}
                  onClick={() => setActive(i)}
                  className={`rounded-2xl p-6 shrink-0 flex flex-col cursor-pointer ${isHidden ? 'hidden md:flex' : 'flex'}`}
                  style={{
                    width: isFocal ? 270 : 230,
                    minHeight: 210,
                    background: '#fff',
                    boxShadow: isFocal
                      ? '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)'
                      : '0 6px 20px rgba(0,0,0,0.06)',
                    transform: `perspective(1000px) rotateY(${rotateY}) translateX(${translateX}) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: 'all 0.55s cubic-bezier(0.34,1,0.64,1)',
                    transformOrigin: 'center bottom',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black mb-4 transition-all duration-300"
                    style={{
                      background: f.bg,
                      color: f.color,
                      transform: isFocal ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {f.letter}
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: '#1a1a2e' }}>{f.label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#718096' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated dot navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-400"
              style={{
                width: active === i ? 24 : 8,
                height: 8,
                background: active === i ? '#11312f' : 'rgba(17,49,47,0.22)',
                transition: 'width 0.4s cubic-bezier(0.34,1,0.64,1), background 0.3s',
                border: 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-12 px-4"
          style={{
            animation: mounted ? 'heroFadeUp 0.8s 0.75s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
            opacity: 0,
          }}
        >
          <Link
            to={user ? '/home' : '/register'}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'var(--accent-primary, #7c3aed)',
              animation: 'btnPulse 2.5s ease-in-out infinite',
            }}
          >
            {user ? 'Go to Dashboard' : 'Get Started for Free'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          {!user && (
            <Link
              to="/login"
              className="text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: '#11312f' }}
            >
              Sign in to your Account →
            </Link>
          )}
        </div>

        {/* Footer */}
        <footer
          className="text-center text-xs pb-6"
          style={{
            color: 'rgba(17,49,47,0.40)',
            animation: mounted ? 'heroFadeUp 0.6s 1s ease forwards' : 'none',
            opacity: 0,
          }}
        >
          © {new Date().getFullYear()} VidStream Platform. Designed for modern creators.
        </footer>
      </div>
    </div>
  );
}
