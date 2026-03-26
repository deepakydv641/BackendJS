import { useState, useEffect } from 'react';
import { getLikedVideos } from '../api/likesApi';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';

export default function LikedVideosPage() {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const { data } = await getLikedVideos();
                setLikes(data.data || []);
            } catch (err) {
                console.error('Failed to fetch liked videos', err);
                setError('Failed to load liked videos');
            } finally {
                setLoading(false);
            }
        };
        fetchLikes();
    }, []);

    if (loading) return <Spinner fullScreen />;

    return (
        <div className="min-h-screen pb-12" style={{ background: 'var(--surface-1)' }}>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                        <svg className="w-8 h-8 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Liked Videos
                    </h1>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                        Videos you have liked across VidStream.
                    </p>
                </div>

                {error ? (
                    <div className="text-center py-12 text-red-400 bg-red-400/10 rounded-xl">
                        {error}
                    </div>
                ) : likes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                        {likes.map((like) => {
                            if (!like.video) return null;
                            return <VideoCard key={like._id} video={like.video} />;
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <h3 className="text-xl font-bold mb-2 text-white">No liked videos yet</h3>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start exploring and like videos you enjoy to see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
