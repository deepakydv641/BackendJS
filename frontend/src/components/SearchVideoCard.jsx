import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import videosApi from '../api/videosApi';
import { toggleSubscription, getSubscribed } from '../api/subscriptionsApi';
import toast from 'react-hot-toast';

export default function SearchVideoCard({ video, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const menuRef = useRef(null);

  // Check initial subscription status
  useEffect(() => {
    if (user?._id && video.owner?._id && user._id !== video.owner._id) {
       getSubscribed(user._id).then(res => {
         const list = res.data.data || [];
         const subbed = list.some(s => s.subscribedDetail?.[0]?._id === video.owner._id || s.channel === video.owner._id);
         setIsSubscribed(subbed);
       }).catch(() => {});
    }
  }, [user, video.owner]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOwner = user?._id && (user._id === video.owner?._id || user._id === video.owner);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this video?")) {
        setShowMenu(false);
        return;
    }
    
    setIsDeleting(true);
    try {
        await videosApi.delete(`/delete-video/${video._id}`);
        setShowMenu(false);
        if (onDelete) {
            onDelete(video._id);
        } else {
            window.location.reload();
        }
    } catch (error) {
        console.error("Failed to delete video", error);
        alert(error.response?.data?.message || "Error deleting video");
        setIsDeleting(false);
    }
  };

  const handleToggleSub = async (e) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    setSubLoading(true);
    try {
      const channelId = video.owner?._id || video.owner;
      await toggleSubscription(channelId);
      const newStatus = !isSubscribed;
      setIsSubscribed(newStatus);
      toast.success(newStatus ? 'Subscribed' : 'Unsubscribed');
      
      // Dispatch event to sync ALL other videos from this channel instantly
      window.dispatchEvent(new CustomEvent('subscriptionToggled', { 
        detail: { channelId, isSubscribed: newStatus } 
      }));
    } catch (err) {
      toast.error('Action failed');
    } finally {
      setSubLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    const toastId = toast.loading('Preparing download...');
    try {
      const { data } = await videosApi.get(`https://vidstream-th0g.onrender.com/api/v1/download/${video._id}`);
      const downloadUrl = data.data?.downloadUrl;
      if (downloadUrl) {
         const link = document.createElement('a');
         link.href = downloadUrl;
         link.setAttribute('download', 'video.mp4');
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         toast.success('Download started!', { id: toastId });
       } else {
         throw new Error("No URL returned");
       }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download video', { id: toastId });
    }
  };

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
      className="group flex flex-col sm:flex-row gap-4 w-full cursor-pointer animate-fade-in transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/video/${video._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative w-full sm:w-[360px] md:w-[400px] lg:w-[450px] shrink-0 aspect-video rounded-xl overflow-hidden"
           style={{
             background: 'var(--surface-3)',
             border: '1px solid rgba(255,255,255,0.05)',
             boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.5)' : 'none'
           }}>
        <img
          src={video.thumbnail?.replace('http://', 'https://')}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
        />
        <div className={`absolute inset-0 transition-opacity duration-300 bg-black/20 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Play button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/60 text-white backdrop-blur-sm">
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-medium text-white bg-black/80 backdrop-blur-sm">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col flex-1 min-w-0 pr-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg sm:text-xl font-medium leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {video.title}
          </h3>
          
          {/* 3 Dots Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${hovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'} text-white mr-[-8px]`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-40 rounded-xl shadow-xl overflow-hidden z-20 border animate-fade-in"
                   style={{ background: 'var(--surface-2)', borderColor: 'rgba(255,255,255,0.1)' }}>
                {isOwner && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); navigate(`/edit-video/${video._id}`, { state: { video } }); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 text-white"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Edit
                    </button>
                    <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  </>
                )}
                <button
                  onClick={handleDownload}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 text-[#a78bfa]"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
          {video.views ?? 0} views • {timeAgo(video.createdAt)}
        </p>

        <div className="flex items-center gap-2 mt-4 cursor-default w-fit" onClick={(e) => e.stopPropagation()}>
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-700 cursor-pointer" onClick={() => navigate(`/channel/${video.owner?.username}`)}>
             {video.owner?.avatar ? (
                <img src={video.owner.avatar.replace('http://', 'https://')} alt="author" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold bg-[#7c3aed] text-white">
                   {(video.owner?.fullName || video.owner?.username || 'U')[0].toUpperCase()}
                </div>
             )}
          </div>
          <span 
            className="text-[13px] hover:text-white cursor-pointer transition-colors" 
            style={{ color: 'var(--text-muted)' }}
            onClick={() => navigate(`/channel/${video.owner?.username}`)}
          >
            {video.owner?.fullName || video.owner?.username || 'Unknown Creator'}
          </span>
          
          {/* Subscribe Button (Visible on hover if not owner/subscribed) */}
          {!isOwner && user?._id !== (video.owner?._id || video.owner) && (
            <button
              onClick={handleToggleSub}
              disabled={subLoading}
              className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded transition-all ml-2
                ${hovered ? 'opacity-100' : 'opacity-0'} 
                ${isSubscribed ? 'bg-white/10 text-white/70' : 'bg-[#e50914] text-white hover:bg-[#b91c1c]'}
              `}
            >
              {subLoading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        {video.description && (
          <p className="text-xs mt-3 line-clamp-2 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
