import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import videosApi from '../api/videosApi';
import { getSubscribers, getSubscribed } from '../api/subscriptionsApi';
import { getLikedVideos } from '../api/likesApi';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';

function StatCard({ label, value, icon, color }) {
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300"
      style={{
        background: `${color}0d`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: `${color}aa` }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}1a`, color }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value ?? '—'}</p>
    </div>
  );
}

function ActionCard({ to, label, desc, icon, gradient }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white transition-transform duration-300 group-hover:scale-110"
        style={{ background: gradient, boxShadow: `0 4px 16px rgba(124,58,237,0.3)` }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
      <svg className="w-4 h-4 shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

const quickActions = [
  {
    to: '/upload-video', label: 'Upload Video', desc: 'Share your content',
    gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
  },
  {
    to: '/update-account', label: 'Update Profile', desc: 'Change name or email',
    gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
  },
  {
    to: '/change-password', label: 'Security', desc: 'Update password',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  },
  {
    to: '/home', label: 'Browse Feed', desc: 'Watch community videos',
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subscribedTo, setSubscribedTo] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'subscribers' | 'subscribed'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, sRes, stRes, lRes] = await Promise.all([
          videosApi.get('/your-videos'),
          getSubscribers(user?._id),
          getSubscribed(user?._id),
          getLikedVideos()
        ]);
        setVideos(vRes.data.data || []);
        setSubscribers(sRes.data.data || []);
        setSubscribedTo(stRes.data.data || []);
        setLikedVideos(lRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Failed to load your profile data.");
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchData();
  }, [user?._id]);

  // inject the current user as the "owner" so the VideoCard can display the avatar and name
  const videosWithOwner = videos.map(v => ({ ...v, owner: user }));

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>

      {/* Top glow */}
      <div className="fixed top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,0.08), transparent)' }} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 animate-slide-up relative">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Profile Details */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            
            {/* Profile Hero */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'var(--surface-2)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}
            >
              {/* Cover */}
              <div className="relative h-36 sm:h-44 overflow-hidden">
                {user?.coverImage ? (
                  <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full" style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(79,70,229,0.2) 50%, rgba(6,182,212,0.15) 100%)',
                  }} />
                )}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, transparent 30%, rgba(15,15,35,0.7))'
                }} />

                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
              </div>

              {/* Avatar + Info */}
              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-12 mb-4">
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-2xl overflow-hidden"
                      style={{
                        border: '3px solid var(--surface-2)',
                        boxShadow: '0 0 0 2px rgba(124,58,237,0.4), 0 8px 24px rgba(0,0,0,0.4)',
                      }}
                    >
                      <img src={user?.avatar} alt="avatar" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{ background: '#10b981', borderColor: 'var(--surface-2)' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>

                  <span className="badge mb-1">
                    <span className="w-1.5 h-1.5 rounded-full text-emerald-400" style={{ background: '#10b981' }} />
                    Active
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {user?.fullName}
                </h2>
                <p className="text-sm mt-0.5 font-medium" style={{ color: '#a78bfa' }}>@{user?.username}</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Videos" value={loading ? '...' : videos.length} color="#7c3aed" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} />
              <StatCard label="Views" value="—" color="#0891b2" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} />
              <StatCard label="Subscribers" value={loading ? '...' : subscribers.length} color="#059669" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
              <StatCard label="Following" value={loading ? '...' : subscribedTo.length} color="#d97706" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map(action => (
                  <ActionCard key={action.to} {...action} />
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Content Tabs */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <div className="flex items-center gap-6 mb-6 border-b border-white/5 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button 
                onClick={() => setActiveTab('videos')}
                className={`pb-3 text-sm font-bold transition-all px-1 relative ${activeTab === 'videos' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Videos
                {activeTab === 'videos' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('subscribers')}
                className={`pb-3 text-sm font-bold transition-all px-1 relative ${activeTab === 'subscribers' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Subscribers ({subscribers.length})
                {activeTab === 'subscribers' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('subscribed')}
                className={`pb-3 text-sm font-bold transition-all px-1 relative ${activeTab === 'subscribed' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Subscribed ({subscribedTo.length})
                {activeTab === 'subscribed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('liked')}
                className={`pb-3 text-sm font-bold transition-all px-1 relative ${activeTab === 'liked' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Liked Videos ({likedVideos.length})
                {activeTab === 'liked' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
              </button>
            </div>

            <div
              className="flex-1 rounded-3xl p-6"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid rgba(255,255,255,0.05)',
                minHeight: '500px',
              }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Spinner />
                  <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
                </div>
              ) : activeTab === 'videos' ? (
                 <>
                  {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <div className="w-20 h-20 rounded-full mb-5 flex items-center justify-center" style={{ background: 'var(--surface-3)', color: 'var(--text-muted)' }}>
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No videos yet</h3>
                      <p className="text-sm px-8 mb-6" style={{ color: 'var(--text-muted)' }}>You haven't uploaded any videos yet.</p>
                      <Link to="/upload-video" className="btn-primary py-2 px-6 rounded-xl font-medium">Upload Now</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 place-content-start">
                      {videosWithOwner.map(video => (
                        <VideoCard key={video._id} video={video} showActions={true} onDelete={(id) => setVideos(prev => prev.filter(v => v._id !== id))} />
                      ))}
                    </div>
                  )}
                 </>
              ) : activeTab === 'subscribers' ? (
                <div className="flex flex-col gap-4">
                  {subscribers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <p className="text-sm text-gray-500">No subscribers yet.</p>
                    </div>
                  ) : (
                    subscribers.map(sub => (
                      <div key={sub._id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <img src={sub.subscriberDetail?.[0]?.avatar} alt="avatar" className="w-10 h-10 rounded-xl object-cover" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate text-white">{sub.subscriberDetail?.[0]?.fullName}</p>
                          <p className="text-xs text-violet-400 truncate">@{sub.subscriberDetail?.[0]?.username}</p>
                        </div>
                        <Link to={`/channel/${sub.subscriberDetail?.[0]?.username}`} className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                          View
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'subscribed' ? (
                <div className="flex flex-col gap-4">
                  {subscribedTo.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <p className="text-sm text-gray-500">You haven't subscribed to anyone yet.</p>
                    </div>
                  ) : (
                    subscribedTo.map(sub => (
                      <div key={sub._id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <img src={sub.subscribedDetail?.[0]?.avatar} alt="avatar" className="w-10 h-10 rounded-xl object-cover" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate text-white">{sub.subscribedDetail?.[0]?.fullName}</p>
                          <p className="text-xs text-sky-400 truncate">@{sub.subscribedDetail?.[0]?.username}</p>
                        </div>
                        <Link to={`/channel/${sub.subscribedDetail?.[0]?.username}`} className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                          View
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'liked' ? (
                <div className="flex flex-col gap-4">
                  {likedVideos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <p className="text-sm text-gray-500">You haven't liked any videos yet.</p>
                      <Link to="/home" className="mt-4 btn-primary py-2 px-6 rounded-xl font-medium">Browse Videos</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 place-content-start">
                      {likedVideos.map(like => (
                        like.video ? <VideoCard key={like._id} video={like.video} /> : null
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
