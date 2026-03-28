import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import videosApi from '../api/videosApi';
import { toggleSubscription, getSubscribed } from '../api/subscriptionsApi';
import { toggleVideoLike, getLikedVideos } from '../api/likesApi';
import Navbar from '../components/Navbar';
import CommentSection from '../components/CommentSection';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

export default function VideoDetailPage() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subLoading, setSubLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                // To display full video, we can try to get it by fetching all and finding it, 
                // or ideally fetch it by ID. If there's no getVideoById endpoint, 
                // we will fetch all and filter for now as a fallback.
                const { data } = await videosApi.get(`/video/${videoId}`).catch(async () => {
                     const allVideos = await videosApi.get('/all-videos');
                     return { data: { data: allVideos.data.data.find(v => v._id === videoId) } };
                });
                
                const vidData = data.data;
                if (!vidData) {
                    toast.error('Video not found');
                    navigate('/home');
                    return;
                }
                setVideo(vidData);

                // Check subscription status
                if (user && vidData.owner?._id && user._id !== vidData.owner._id) {
                    const res = await getSubscribed(user._id).catch(() => ({ data: { data: [] } }));
                    const list = res.data.data || [];
                    const subbed = list.some(s => s.subscribedDetail?.[0]?._id === vidData.owner._id || s.channel === vidData.owner._id);
                    setIsSubscribed(subbed);
                }

                // Check liked status
                if (user) {
                    const likedRes = await getLikedVideos().catch(() => ({ data: { data: [] } }));
                    const likedList = likedRes.data?.data || [];
                    const liked = likedList.some(like => like.video?._id === videoId || like.video === videoId);
                    setIsLiked(liked);
                    
                    // Add to watch history silently
                    videosApi.post(`/watch-history/${videoId}`).catch(console.error);
                }
            } catch (error) {
                console.error('Failed to fetch video', error);
                toast.error('Failed to load video');
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [videoId, user, navigate]);

    const handleToggleSub = async () => {
        if (!user) return navigate('/login');
        setSubLoading(true);
        try {
            await toggleSubscription(video.owner?._id || video.owner);
            setIsSubscribed(!isSubscribed);
            toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed');
        } catch (err) {
            toast.error('Action failed');
        } finally {
            setSubLoading(false);
        }
    };

    const handleToggleLike = async () => {
        if (!user) return navigate('/login');
        setLikeLoading(true);
        try {
            await toggleVideoLike(videoId);
            setIsLiked(!isLiked);
            toast.success(isLiked ? 'Like removed' : 'Video liked');
        } catch (err) {
            toast.error('Failed to toggle like');
        } finally {
            setLikeLoading(false);
        }
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

    if (loading) return <Spinner fullScreen />;
    if (!video) return null;

    const isOwner = user?._id && (user._id === video.owner?._id || user._id === video.owner);

    return (
        <div className="min-h-screen pb-12" style={{ background: 'var(--surface-1)' }}>
            <Navbar />
            
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 animate-fade-in flex flex-col lg:flex-row gap-8">
                
                {/* Main Content (Video + Info + Comments) */}
                <div className="flex-1 w-full max-w-4xl mx-auto lg:mx-0">
                    
                    {/* Video Player */}
                    <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-xl" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                        <video
                            src={video.videoFile?.replace('http://', 'https://')}
                            poster={video.thumbnail?.replace('http://', 'https://')}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Video Info */}
                    <div className="mt-4 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {video.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                            <span>{video.views || 0} views</span>
                            <span>•</span>
                            <span>{timeAgo(video.createdAt)}</span>
                        </div>
                    </div>

                    {/* Owner Info and Subscription */}
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid rgba(124,58,237,0.3)' }}>
                                {video.owner?.avatar ? (
                                    <img src={video.owner.avatar.replace('http://', 'https://')} alt="author" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }}>
                                        {(video.owner?.fullName || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                                    {video.owner?.fullName || 'Unknown Creator'}
                                </h3>
                                {/* Could add sub count here if available */}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                            <button
                                onClick={handleToggleLike}
                                disabled={likeLoading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all text-sm"
                                style={{
                                    background: isLiked ? 'rgba(124,58,237,0.1)' : 'var(--surface-2)',
                                    color: isLiked ? '#a78bfa' : 'var(--text-primary)',
                                    border: '1px solid',
                                    borderColor: isLiked ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.1)'
                                }}
                            >
                                <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isLiked ? 0 : 2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                {likeLoading ? '...' : isLiked ? 'Liked' : 'Like'}
                            </button>

                            {!isOwner && user?._id !== (video.owner?._id || video.owner) && (
                                <button
                                    onClick={handleToggleSub}
                                    disabled={subLoading}
                                    className="px-6 py-2.5 rounded-full font-bold transition-all text-sm"
                                    style={{
                                        background: isSubscribed ? 'rgba(255,255,255,0.1)' : 'var(--text-primary)',
                                        color: isSubscribed ? 'var(--text-primary)' : 'var(--surface-1)',
                                    }}
                                >
                                    {subLoading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {video.description && (
                        <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}>
                            <p className="whitespace-pre-wrap">{video.description}</p>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="mt-8">
                        <CommentSection videoId={video._id} />
                    </div>

                </div>

                {/* Sidebar (Recommendations - Could add later) */}
                <div className="w-full lg:w-[350px] shrink-0 hidden xl:block">
                    {/* Placeholder for future recommended videos */}
                </div>
            </div>
        </div>
    );
}
