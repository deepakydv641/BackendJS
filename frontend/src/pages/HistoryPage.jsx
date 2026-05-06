import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usersApi from '../api/usersApi';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to see watch history');
      setLoading(false);
      return;
    }
    setLoading(true);
    usersApi.get('/watch-history')
      .then(({ data }) => setHistory(data.data[0]?.WatchHistory || data.data || []))
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to load history');
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--accent-primary)', border: '1px solid rgba(124,58,237,0.25)' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch History
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Watch&nbsp;
            <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              History
            </span>
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            Videos you have watched recently
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 pb-12">
          {Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 pb-12">
          {history.map((video, i) => (
            <div key={video._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 animate-float"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.15))',
              border: '1px solid rgba(124,58,237,0.25)',
              boxShadow: '0 0 40px rgba(124,58,237,0.10)'
            }}
          >
            <svg className="w-12 h-12" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No watch history</h2>
          <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--text-muted)' }}>
            Videos you watch will appear here automatically.
          </p>
          <Link to="/home" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Explore Videos
          </Link>
        </div>
      )}
    </div>
  );
}
