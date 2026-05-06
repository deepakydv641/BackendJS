import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import videosApi from '../api/videosApi';
import { toggleSubscription, getSubscribed } from '../api/subscriptionsApi';
import toast from 'react-hot-toast';

export default function VideoCard({ video, onDelete, showActions = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);
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

  // Listen for global subscription toggle events
  useEffect(() => {
    const handleGlobalToggle = (e) => {
      const channelId = video.owner?._id || video.owner;
      if (e.detail?.channelId === channelId) {
        setIsSubscribed(e.detail.isSubscribed);
      }
    };
    window.addEventListener('subscriptionToggled', handleGlobalToggle);
    return () => window.removeEventListener('subscriptionToggled', handleGlobalToggle);
  }, [video]);

  const isOwner = showActions && user?._id && (user._id === video.owner?._id || user._id === video.owner);

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
      const { data } = await videosApi.get(`${import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://vidstream-th0g.onrender.com'}/api/v1/download/${video._id}`);
      const downloadUrl = data.data?.downloadUrl;
      if (downloadUrl) {
         // Create a hidden link and click it to download
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
      className="group flex flex-col gap-3 cursor-pointer animate-fade-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-video rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-3)',
          border: '1px solid var(--border-subtle)',
          boxShadow: hovered
            ? '0 8px 30px rgba(0,0,0,0.1), 0 0 0 1px var(--accent-primary)'
            : '0 2px 12px rgba(0,0,0,0.05)',
          transform: hovered ? 'scale(1.01) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={() => navigate(`/video/${video._id}`)}
      >
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
      </div>

      {/* Meta */}
      <div className="flex gap-3 px-1 relative">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl shrink-0 overflow-hidden" style={{ border: '2px solid rgba(124,58,237,0.15)' }}>
          {video.owner?.avatar ? (
            <img src={video.owner.avatar.replace('http://', 'https://')} alt="author" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--brand-primary)', color: 'white' }}>
              {(video.owner?.fullName || video.owner?.username || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>

        <div 
          className="flex flex-col min-w-0 gap-0.5 flex-1 cursor-default relative" 
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setNameHovered(true)}
          onMouseLeave={() => setNameHovered(false)}
        >
          <h3
            onClick={() => navigate(`/video/${video._id}`)}
            className="text-sm font-semibold leading-tight line-clamp-2 transition-colors duration-200 cursor-pointer"
            style={{ color: hovered ? 'var(--accent-primary)' : 'var(--text-primary)' }}
          >
            {video.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 min-h-[1.25rem]">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--text-muted)' }}>
              {video.owner?.fullName || video.owner?.username || 'Unknown Creator'}
            </p>
            
            {/* Subscribe button appears on name hover */}
            {!isOwner && user?._id !== (video.owner?._id || video.owner) && (
              <button
                onClick={handleToggleSub}
                disabled={subLoading}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-300 transform ${
                  nameHovered || isSubscribed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
                }`}
                style={{
                  background: isSubscribed ? 'rgba(255,255,255,0.1)' : 'var(--brand-primary)',
                  color: 'white',
                  border: isSubscribed ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}
              >
                {subLoading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {timeAgo(video.createdAt)}
          </p>
        </div>

        {/* 3 Dots Menu (Always visible now) */}
        <div className="relative shrink-0" ref={menuRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 w-40 rounded-xl shadow-xl overflow-hidden z-20 border animate-fade-in"
                 style={{ background: 'var(--surface-3)', borderColor: 'var(--border-subtle)' }}>
              
              {/* Owner Actions */}
              {isOwner && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); navigate(`/edit-video/${video._id}`, { state: { video } }); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition-colors flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <div className="w-full h-px" style={{ background: 'var(--border-subtle)' }} />
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-black/5 transition-colors flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <span className="w-4 h-4 rounded-full border-2 border-red-600 border-t-transparent animate-spin inline-block"></span>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <div className="w-full h-px" style={{ background: 'var(--border-subtle)' }} />
                </>
              )}
              
              {/* Universal Action */}
              <button
                onClick={handleDownload}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition-colors flex items-center gap-2"
                style={{ color: 'var(--accent-primary)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
