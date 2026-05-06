import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import videosApi from '../api/videosApi';
import usersApi from '../api/usersApi';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';
import TweetCard from '../components/TweetCard';
import CreateTweetForm from '../components/CreateTweetForm';
import { getAllTweets } from '../api/tweetsApi';
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

function TweetSkeleton() {
  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ background: 'var(--surface-2)', borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-3">
        <div className="skeleton w-11 h-11 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="skeleton aspect-video rounded-xl" />
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [history, setHistory] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchTweets = () => {
    setTweetsLoading(true);
    getAllTweets()
      .then(({ data }) => setTweets(data.data || []))
      .catch(() => setTweets([]))
      .finally(() => setTweetsLoading(false));
  };

  useEffect(() => {
    videosApi.get('/all-videos')
      .then(({ data }) => setVideos(data.data || []))
      .catch(() => toast.error('Failed to load videos'))
      .finally(() => setVideosLoading(false));

    fetchTweets();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      if (!user) {
        toast.error("Please login to see watch history");
        return;
      }
      setHistoryLoading(true);
      usersApi.get('/watch-history')
        .then(({ data }) => setHistory(data.data[0]?.WatchHistory || data.data || []))
        .catch((err) => {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to load history');
            setHistory([]);
        })
        .finally(() => setHistoryLoading(false));
    }
  }, [activeTab, user]);

  const tabs = [
    { key: 'videos', label: 'Videos', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )},
    { key: 'community', label: 'Community', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )},
    { key: 'history', label: 'History', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(229,9,20,0.12)', color: '#f87171', border: '1px solid rgba(229,9,20,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Live Feed
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {activeTab === 'videos' ? <>Explore&nbsp;<span style={{ background: 'linear-gradient(135deg,#e50914,#f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Videos</span></> : 
               activeTab === 'community' ? <>Community&nbsp;<span style={{ background: 'linear-gradient(135deg,#e50914,#f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Posts</span></> :
               <>Watch&nbsp;<span style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>History</span></>}
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              {activeTab === 'videos' ? 'Discover amazing content from the community' : 
               activeTab === 'community' ? 'See what creators are sharing' :
               'Review videos you have watched recently'}
            </p>
          </div>

          {activeTab === 'videos' && (
            <Link to="/upload-video" className="btn-primary self-start sm:self-auto flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Upload Video
            </Link>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-8 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeTab === tab.key 
                ? 'border-transparent shadow-md' 
                : 'border-[var(--border-subtle)] hover:bg-black/5'
              }`}
              style={{
                background: activeTab === tab.key ? 'var(--sidebar-bg)' : 'var(--surface-3)',
                color: activeTab === tab.key ? 'white' : 'var(--text-muted)'
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.key === 'community' && tweets.length > 0 && (
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-white/20' : 'bg-black/10'}`}>
                  {tweets.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          videosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 pb-12">
              {Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 pb-12">
              {videos.map((video, i) => (
                <div key={video._id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 animate-float"
                style={{ background: 'linear-gradient(135deg,rgba(229,9,20,0.15),rgba(244,63,94,0.15))', border: '1px solid rgba(229,9,20,0.3)', boxShadow: '0 0 40px rgba(229,9,20,0.15)' }}>
                <svg className="w-12 h-12" style={{ color: '#e50914' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No videos yet</h2>
              <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--text-muted)' }}>Be the first to share your story with the world.</p>
              <Link to="/upload-video" className="btn-primary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Upload First Video
              </Link>
            </div>
          )
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="max-w-2xl mx-auto pb-12">
            {/* Create Post — visible to any logged-in user */}
            {user && (
              <CreateTweetForm onTweetCreated={fetchTweets} />
            )}

            {tweetsLoading ? (
              <div className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => <TweetSkeleton key={i} />)}
              </div>
            ) : tweets.length > 0 ? (
              <div className="space-y-5">
                {tweets.map(tweet => (
                  <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    onDelete={(id) => setTweets(prev => prev.filter(t => t._id !== id))}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 animate-float"
                  style={{ background: 'linear-gradient(135deg,rgba(229,9,20,0.15),rgba(244,63,94,0.15))', border: '1px solid rgba(229,9,20,0.3)' }}>
                  <svg className="w-10 h-10" style={{ color: '#e50914' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {user ? 'Be the first to post!' : 'No community posts yet'}
                </h2>
                <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
                  {user ? 'Use the form above to share your first post with the community.' : 'Log in and be the first creator to share a community post.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          historyLoading ? (
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
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 animate-float"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.15))', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 0 40px rgba(124,58,237,0.15)' }}>
                <svg className="w-12 h-12" style={{ color: '#7c3aed' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No watch history</h2>
              <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--text-muted)' }}>Videos you watch will appear here.</p>
              <button onClick={() => setActiveTab('videos')} className="btn-primary flex items-center gap-2">
                Explore Videos
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
}
