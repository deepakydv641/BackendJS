import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChannelProfile } from '../api/usersApi';
import { toggleSubscription } from '../api/subscriptionsApi';
import videosApi from '../api/videosApi';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import VideoCard from '../components/VideoCard';
import toast from 'react-hot-toast';

export default function ChannelPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        // 1. Fetch channel profile
        const profileRes = await getChannelProfile(username);
        const channelData = profileRes.data.data;
        setProfile(channelData);
        
        // 2. We don't have a specific `getUserVideos(userId)` endpoint yet. 
        // We will fetch all videos and filter by owner username on frontend for now. 
        // In a real production app, you should create a backend route for this.
        const videosRes = await videosApi.get('/all-videos');
        const allVideos = videosRes.data.data || [];
        
        // Filter videos manually 
        const channelVideos = allVideos.filter(
            v => v.owner?.username === username || v.owner === channelData._id
        );
        setVideos(channelVideos);
        
      } catch (err) {
        console.error("Failed to fetch channel", err);
        setError("Channel not found or error loading data.");
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchChannelData();
    }
  }, [username]);

  const handleToggleSub = async () => {
    if (!profile) return;
    setSubLoading(true);
    try {
      await toggleSubscription(profile._id);
      
      // Update local state to reflect UI change instantly
      setProfile(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
      }));
      
      toast.success(profile.isSubscribed ? `Unsubscribed from ${profile.fullName}` : `Subscribed to ${profile.fullName}`);
    } catch (err) {
      toast.error('Failed to change subscription');
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--surface-1)' }}>
        <Spinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Channel Not Found</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary py-2 px-6 rounded-xl font-medium">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
      <Navbar />

      {/* Top Banner / Cover */}
      <div className="w-full h-48 sm:h-64 md:h-80 relative overflow-hidden">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(90deg, #1e1e2f, #2d2b55, #1e1e2f)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative -mt-16 sm:-mt-24 pb-12">
        {/* Channel Header Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 mb-12">
          
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shrink-0" 
               style={{ border: '4px solid var(--surface-1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-violet-600">
                {profile.fullName?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left pt-4 sm:pt-0">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1">{profile.fullName}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-sm text-gray-400 font-medium mb-4">
              <span>@{profile.username}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span>{profile.subscribersCount} subscribers</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span>{videos.length} videos</span>
            </div>

            <button
              onClick={handleToggleSub}
              disabled={subLoading}
              className={`py-2.5 px-6 rounded-full font-bold text-sm transition-all duration-300 ${
                profile.isSubscribed 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              }`}
            >
              {subLoading ? '...' : profile.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Channel Videos */}
        <h3 className="text-xl font-bold text-white mb-6">Videos</h3>
        
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl" style={{ background: 'var(--surface-2)' }}>
            <p className="text-gray-400">This channel hasn't uploaded any videos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map(video => (
              <VideoCard key={video._id} video={{...video, owner: profile}} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
