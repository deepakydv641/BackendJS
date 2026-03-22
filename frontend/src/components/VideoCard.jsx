import { useState } from 'react';

export default function VideoCard({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    if (d < 7) return `${d}d ago`;
    const w = Math.floor(d / 7);
    if (w < 5) return `${w}w ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.floor(d / 365)}y ago`;
  };

  return (
    <div
      className="group flex flex-col gap-3 cursor-pointer animate-fade-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-video rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-3)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: hovered
            ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15)'
            : '0 2px 12px rgba(0,0,0,0.3)',
          transform: hovered ? 'scale(1.01) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={() => !isPlaying && setIsPlaying(true)}
      >
        {isPlaying ? (
          <video
            src={video.videoFile?.replace('http://', 'https://')}
            poster={video.thumbnail?.replace('http://', 'https://')}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <img
              src={video.thumbnail?.replace('http://', 'https://')}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to top, rgba(8,8,26,0.75) 0%, rgba(8,8,26,0.2) 40%, transparent 70%)',
                opacity: hovered ? 1 : 0.5,
              }}
            />

            {/* Play button */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-300"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'rgba(124,58,237,0.85)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 0 30px rgba(124,58,237,0.6)',
                  transform: hovered ? 'scale(1)' : 'scale(0.8)',
                }}
              >
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Duration badge */}
            {video.duration ? (
              <div
                className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg text-xs font-bold text-white"
                style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', letterSpacing: '0.02em' }}
              >
                {formatDuration(video.duration)}
              </div>
            ) : null}

            {/* Views badge (top left) */}
            <div
              className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-xs font-semibold transition-opacity duration-300"
              style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                color: 'rgba(255,255,255,0.75)',
                opacity: hovered ? 1 : 0,
              }}
            >
              {video.views ?? 0} views
            </div>
          </>
        )}
      </div>

      {/* Meta */}
      <div className="flex gap-3 px-1">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl shrink-0 overflow-hidden" style={{ border: '2px solid rgba(124,58,237,0.3)' }}>
          {video.owner?.avatar ? (
            <img src={video.owner.avatar.replace('http://', 'https://')} alt="author" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }}>
              {(video.owner?.fullName || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 gap-0.5">
          <h3
            className="text-sm font-semibold leading-tight line-clamp-2 transition-colors duration-200"
            style={{ color: hovered ? '#a78bfa' : 'var(--text-primary)' }}
          >
            {video.title}
          </h3>
          <p className="text-xs font-medium truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {video.owner?.fullName || 'Unknown Creator'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
