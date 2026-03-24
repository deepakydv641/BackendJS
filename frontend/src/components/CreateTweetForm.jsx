import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTweet } from '../api/tweetsApi';
import toast from 'react-hot-toast';

export default function CreateTweetForm({ onTweetCreated }) {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [posterFile, setPosterFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const fileRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        setPosterFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setPosterFile(null);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) { toast.error('Please write something'); return; }
        if (!posterFile) { toast.error('Please attach an image'); return; }
        setSubmitting(true);
        const fd = new FormData();
        fd.append('Content', content);
        fd.append('poster', posterFile);
        try {
            await createTweet(fd);
            toast.success('Posted!');
            setContent('');
            clearImage();
            onTweetCreated?.();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="rounded-2xl border mb-8 overflow-hidden"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border-medium)' }}
        >
            {/* Form header */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div
                    className="w-10 h-10 rounded-full shrink-0 overflow-hidden"
                    style={{ border: '2px solid rgba(229,9,20,0.35)' }}
                >
                    {user?.avatar ? (
                        <img src={user.avatar.replace('http://', 'https://')} alt="me" className="w-full h-full object-cover" />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#e50914,#f43f5e)' }}
                        >
                            {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {user?.fullName || user?.username}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Create a new post</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 space-y-4">
                {/* Text Area */}
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Share something with your community..."
                    rows={3}
                    className="w-full resize-none bg-transparent outline-none text-sm leading-relaxed placeholder-[var(--text-muted)]"
                    style={{ color: 'var(--text-primary)' }}
                />

                {/* Image Preview */}
                {preview && (
                    <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-medium)' }}>
                        <img src={preview} alt="Preview" className="w-full max-h-[320px] object-cover" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors hover:bg-red-500"
                            style={{ background: 'rgba(0,0,0,0.65)' }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    {/* Attach image */}
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-white/6"
                        style={{ color: posterFile ? '#e50914' : 'var(--text-secondary)' }}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {posterFile ? posterFile.name.slice(0, 20) + (posterFile.name.length > 20 ? '…' : '') : 'Add Image'}
                    </button>
                    <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />

                    <button
                        type="submit"
                        disabled={submitting || !content.trim() || !posterFile}
                        className="text-sm font-bold px-6 py-2 rounded-full text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                        style={{ background: 'linear-gradient(135deg,#e50914,#f43f5e)', boxShadow: content.trim() && posterFile ? '0 0 18px rgba(229,9,20,0.35)' : 'none' }}
                    >
                        {submitting ? 'Posting…' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
