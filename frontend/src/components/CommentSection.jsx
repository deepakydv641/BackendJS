import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import commentsApi from '../api/commentsApi';
import { toggleCommentLike } from '../api/likesApi';
import toast from 'react-hot-toast';

export default function CommentSection({ videoId, tweetId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [likedComments, setLikedComments] = useState({});

    const fetchComments = async () => {
        try {
            let data;
            if (videoId) {
                const response = await commentsApi.getVideoComments(videoId);
                data = response.data;
            } else if (tweetId) {
                const response = await commentsApi.getTweetComments(tweetId);
                data = response.data;
            }
            setComments(data?.data || []);
        } catch (error) {
            console.error('Failed to load comments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (videoId || tweetId) fetchComments();
        
        // Close menu when clicking outside
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [videoId, tweetId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!user) {
            toast.error('Please login to comment');
            return;
        }

        const tempComment = newComment;
        setNewComment('');
        setIsInputFocused(false);
        setSubmitting(true);

        try {
            if (videoId) {
                await commentsApi.addComment(videoId, tempComment);
            } else if (tweetId) {
                await commentsApi.addCommentOnTweet(tweetId, tempComment);
            }
            setNewComment('');
            setIsInputFocused(false);
            
            await fetchComments();
            toast.success('Comment added');
        } catch (error) {
            console.error("Comment Add Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete comment?')) return;
        try {
            await commentsApi.deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleToggleCommentLike = async (commentId) => {
        if (!user) {
            toast.error('Please login to like');
            return;
        }
        try {
            await toggleCommentLike(commentId);
            setLikedComments(prev => ({ ...prev, [commentId]: !prev[commentId] }));
            toast.success(likedComments[commentId] ? 'Like removed' : 'Comment liked');
        } catch (error) {
            toast.error('Failed to toggle like');
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment._id);
        setEditContent(comment.content);
        setActiveMenuId(null);
    };

    const handleEditSubmit = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            await commentsApi.updateComment(commentId, editContent);
            setEditingId(null);
            fetchComments();
            toast.success('Comment updated');
        } catch (error) {
            toast.error('Failed to update comment');
        }
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const d = Math.floor(diff / 86400000);
        if (d === 0) return 'Today';
        if (d === 1) return 'Yesterday';
        if (d < 7) return `${d} days ago`;
        const w = Math.floor(d / 7);
        if (w < 5) return `${w} weeks ago`;
        const mo = Math.floor(d / 30);
        if (mo < 12) return `${mo} months ago`;
        return `${Math.floor(d / 365)} years ago`;
    };

    return (
        <div className="mt-6 w-full max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-8 mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {comments.length} Comments
                </h3>
                {/* Sort functionality can be added later */}
                <button className="flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Sort by
                </button>
            </div>

            {/* Add Comment Input */}
            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden" style={{ border: '2px solid rgba(124,58,237,0.3)' }}>
                    {user?.avatar ? (
                        <img src={user.avatar.replace('http://', 'https://')} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }}>
                            {user?.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
                
                <form onSubmit={handleAddComment} className="flex-1 flex flex-col">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-b border-gray-600 focus:border-violet-500 transition-colors outline-none pb-1 text-sm"
                        style={{ color: 'var(--text-primary)' }}
                    />
                    
                    {isInputFocused && (
                        <div className="flex justify-end gap-3 mt-3 animate-fade-in">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsInputFocused(false);
                                    setNewComment('');
                                }} 
                                className="text-sm px-4 py-2 hover:bg-white/10 rounded-full font-medium transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={!newComment.trim() || submitting} 
                                className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${
                                    newComment.trim() && !submitting 
                                    ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                                }`}
                            >
                                {submitting ? 'Commenting...' : 'Comment'}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="animate-pulse space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full shrink-0" />
                            <div className="flex-1">
                                <div className="h-3 bg-white/10 rounded w-40 mb-2" />
                                <div className="h-3 bg-white/10 rounded w-full mb-1" />
                                <div className="h-3 bg-white/10 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => {
                        // Support both the populated nested object AND the legacy aggregate array lookup
                        const owner = comment.owner || comment.OwnerDetails?.[0];
                        const isOwner = user && owner && user._id === owner._id;

                        return (
                            <div key={comment._id} className="group flex gap-4">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden cursor-pointer" style={{ border: '2px solid rgba(124,58,237,0.3)' }}>
                                    {owner?.avatar ? (
                                        <img src={owner.avatar.replace('http://', 'https://')} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }}>
                                            {(owner?.fullName || owner?.username || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Comment Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-sm hover:underline cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                                            {owner?.fullName || owner?.username || 'Unknown User'}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {timeAgo(comment.createdAt)}
                                        </span>
                                    </div>

                                    {editingId === comment._id ? (
                                        <div className="flex flex-col items-end gap-2 mt-2 w-full">
                                            <input
                                                type="text"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-transparent border-b border-violet-500 outline-none pb-1 text-sm"
                                                style={{ color: 'var(--text-primary)' }}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white" style={{ color: 'var(--text-primary)' }}>Cancel</button>
                                                <button onClick={() => handleEditSubmit(comment._id)} className="text-xs px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--text-primary)' }} className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                                    )}

                                    {/* Interaction Buttons (Like, Dislike, Reply) */}
                                    <div className="flex items-center gap-4 mt-2">
                                        <button onClick={() => handleToggleCommentLike(comment._id)} className="flex items-center gap-1.5 hover:bg-white/10 rounded-full p-1.5 transition-colors text-white/70 hover:text-white" aria-label="Like" style={{ color: likedComments[comment._id] ? '#a78bfa' : 'currentColor' }}>
                                            <svg className="w-4 h-4" fill={likedComments[comment._id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={likedComments[comment._id] ? 0 : 1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                        </button>
                                        <button className="flex items-center gap-1.5 hover:bg-white/10 rounded-full p-1.5 transition-colors text-white/70 hover:text-white" aria-label="Dislike">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                            </svg>
                                        </button>
                                        <button className="text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors" style={{ color: 'var(--text-primary)' }}>
                                            Reply
                                        </button>
                                    </div>
                                </div>

                                {/* 3-dot Menu (Only for owner) */}
                                {isOwner && editingId !== comment._id && (
                                    <div className="relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === comment._id ? null : comment._id);
                                            }}
                                            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>
                                        
                                        {activeMenuId === comment._id && (
                                            <div className="absolute right-0 top-10 w-32 rounded-lg shadow-xl overflow-hidden z-20 border animate-fade-in py-1"
                                                 style={{ background: 'var(--surface-2)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startEdit(comment); }}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2 text-white"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); handleDelete(comment._id); }}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2 text-red-500"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="py-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to start the conversation!</p>
            )}
        </div>
    );
}
