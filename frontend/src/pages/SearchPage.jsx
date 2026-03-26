import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
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

export default function SearchPage() {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`https://sharewithall.onrender.com/api/v1/search/${encodeURIComponent(query)}`, { 
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setVideos(res.data?.data || []);
      } catch (error) {
        console.error("Search error:", error);
        toast.error('Failed to fetch search results');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Search results for "{query}"
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Found {loading ? '...' : videos.length} videos matching your search
          </p>
        </div>

        {/* Grid */}
        {loading ? (
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
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl" style={{ background: 'var(--surface-2)' }}>
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(82,82,91,0.2), rgba(63,63,70,0.2))',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">No results found</h2>
            <p className="text-sm max-w-xs text-gray-400">
              Try different keywords or check your spelling to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
