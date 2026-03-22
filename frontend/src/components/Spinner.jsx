export default function Spinner({ size = 'md', fullScreen = false }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-2',
  };

  const spinner = (
    <div
      className={`${sizes[size]} rounded-full animate-spin`}
      style={{
        borderColor: 'rgba(124,58,237,0.2)',
        borderTopColor: '#7c3aed',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
        style={{ background: 'var(--surface-1)' }}
      >
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              boxShadow: '0 0 40px rgba(124,58,237,0.5)',
            }}
          >
            <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return spinner;
}
