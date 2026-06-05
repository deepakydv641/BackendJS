import { useState, useEffect } from 'react';
import { getLikedVideos } from '../api/likesApi';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';

function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton aspect-video rounded-2xl" />
      <div className="flex gap-3 px-1">
        <div className="skeleton w-9 h-9 rounded-xl shrink-0" />
        <div className="flex flex-col gap-2 flex-1 pt-1">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function LikedVideosPage() {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const { data } = await getLikedVideos();
                setLikes(data.data || []);
            } catch (err) {
                console.error('Failed to fetch liked videos', err);
                setError('Failed to load liked videos');
            } finally {
                setLoading(false);
            }
        };
        fetchLikes();
    }, []);

    return (
        <div className="min-h-screen animate-slide-up">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(229,9,20,0.12)', color: '#f87171', border: '1px solid rgba(229,9,20,0.3)' }}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            Liked Videos
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Liked&nbsp;
                        <span style={{ background: 'linear-gradient(135deg,#e50914,#f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Videos
                        </span>
                    </h1>
                    <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                        Videos you have liked across VidStream.
                    </p>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 pb-12">
                    {Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-400 bg-red-400/10 rounded-xl">
                    {error}
                </div>
            ) : likes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 pb-12">
                    {likes.map((like, i) => {
                        if (!like.video) return null;
                        return (
                            <div key={like._id} style={{ animationDelay: `${i * 0.05}s` }}>
                                <VideoCard video={like.video} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                    <div
                        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 animate-float"
                        style={{
                            background: 'linear-gradient(135deg, rgba(229,9,20,0.15), rgba(244,63,94,0.15))',
                            border: '1px solid rgba(229,9,20,0.3)',
                            boxShadow: '0 0 40px rgba(229,9,20,0.15)'
                        }}
                    >
                        <svg className="w-12 h-12" style={{ color: '#e50914' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No liked videos yet</h2>
                    <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--text-muted)' }}>
                        Start exploring and like videos you enjoy to see them here.
                    </p>
                </div>
            )}
        </div>
    );
}
