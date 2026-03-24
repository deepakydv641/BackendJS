import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateTweet, deleteTweet } from '../api/tweetsApi';
import toast from 'react-hot-toast';

function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    const w = Math.floor(d / 7);
    if (w < 5) return `${w}w ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.floor(d / 365)}y ago`;
}

export default function TweetCard({ tweet, onDelete }) {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(tweet.content);
    const [liveContent, setLiveContent] = useState(tweet.content);

    const owner = tweet.owner;
    const isOwner = user && owner && (user._id === owner._id || user._id === owner);

    const handleEditSave = async () => {
        if (!editContent.trim()) return;
        try {
            await updateTweet(tweet._id, editContent);
            setLiveContent(editContent);
            setEditing(false);
            toast.success('Post updated!');
        } catch {
            toast.error('Failed to update post');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await deleteTweet(tweet._id);
            toast.success('Post deleted');
            onDelete?.(tweet._id);
        } catch {
            toast.error('Failed to delete post');
        }
    };

    const posterUrl = tweet.poster?.replace('http://', 'https://');

    return (
        <article
            className="rounded-2xl border overflow-hidden transition-all duration-200 hover:border-white/10"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border-subtle)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-11 h-11 rounded-full shrink-0 overflow-hidden"
                        style={{ border: '2px solid rgba(229,9,20,0.35)' }}
                    >
                        {owner?.avatar ? (
                            <img
                                src={owner.avatar.replace('http://', 'https://')}
                                alt={owner.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center font-bold text-white text-base"
                                style={{ background: 'linear-gradient(135deg,#e50914,#f43f5e)' }}
                            >
                                {(owner?.fullName || owner?.username || 'U')[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                            {owner?.fullName || owner?.username || 'Unknown'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            @{owner?.username} · {timeAgo(tweet.createdAt)}
                        </p>
                    </div>
                </div>

                {isOwner && !editing && (
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(v => !v)}
                            className="p-2 rounded-full transition-colors hover:bg-white/8"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>
                        {menuOpen && (
                            <div
                                className="absolute right-0 mt-1 w-36 rounded-xl border shadow-2xl overflow-hidden z-30 animate-fade-in"
                                style={{ background: 'var(--surface-3)', borderColor: 'var(--border-medium)' }}
                            >
                                <button
                                    onClick={() => { setEditing(true); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2.5 hover:bg-white/6 transition-colors"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => { setMenuOpen(false); handleDelete(); }}
                                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2.5 hover:bg-red-500/10 transition-colors text-red-400"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="px-5 pb-4">
                {editing ? (
                    <div className="space-y-3">
                        <textarea
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none min-h-[96px]"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(229,9,20,0.5)',
                                color: 'var(--text-primary)'
                            }}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => { setEditing(false); setEditContent(liveContent); }}
                                className="text-xs px-4 py-1.5 rounded-full hover:bg-white/8 transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={!editContent.trim()}
                                className="text-xs px-4 py-1.5 rounded-full font-semibold text-white transition-colors disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg,#e50914,#f43f5e)' }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                        {liveContent}
                    </p>
                )}
            </div>

            {/* Poster Image */}
            {posterUrl && !editing && (
                <div className="mx-5 mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                    <img
                        src={posterUrl}
                        alt="Post attachment"
                        className="w-full h-auto max-h-[520px] object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Footer actions */}
            {!editing && (
                <div
                    className="flex items-center gap-6 px-5 py-3 border-t"
                    style={{ borderColor: 'var(--border-subtle)' }}
                >
                    <button
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-red-400"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Like
                    </button>
                    <button
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Comment
                    </button>
                </div>
            )}
        </article>
    );
}
