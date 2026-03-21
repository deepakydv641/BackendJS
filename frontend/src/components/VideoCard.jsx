import { useState } from 'react';

export default function VideoCard({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      {/* Thumbnail Container */}
      <div 
        className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-800"
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
            onDoubleClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <img 
              src={video.thumbnail?.replace('http://', 'https://')} 
              alt={video.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Play icon overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
                <svg className="w-6 h-6 text-white ml-1 shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {video.duration ? (
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white px-1.5 py-0.5 rounded text-xs font-medium">
                {formatDuration(video.duration)}
              </div>
            ) : null}
          </>
        )}
      </div>
      
      {/* Details */}
      <div className="flex gap-3 px-1">
        {/* Author Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 shrink-0 overflow-hidden border border-gray-200 dark:border-zinc-700">
          {video.owner?.avatar ? (
            <img src={video.owner.avatar.replace('http://', 'https://')} alt="author" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-full h-full text-gray-400 dark:text-zinc-600 p-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
        
        <div className="flex flex-col min-w-0">
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-sm leading-tight line-clamp-2 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {video.title}
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 text-xs mt-1 truncate">
            {video.owner?.fullName || 'User'}
          </p>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-500 text-xs mt-0.5">
            <span>{video.views || 0} views</span>
            <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-zinc-600" />
            <span>{new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
