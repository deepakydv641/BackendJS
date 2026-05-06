import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SearchVideoCard from '../components/SearchVideoCard';
import toast from 'react-hot-toast';

function VideoCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full animate-pulse">
      <div className="w-full sm:w-[360px] md:w-[400px] lg:w-[450px] aspect-video rounded-xl skeleton shrink-0" />
      <div className="flex flex-col gap-2 flex-1 pt-2">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/4 rounded mt-1" />
        <div className="flex items-center gap-2 mt-4">
          <div className="skeleton w-6 h-6 rounded-full" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
        <div className="skeleton h-3 w-full rounded mt-3" />
        <div className="skeleton h-3 w-4/5 rounded" />
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
        const res = await axios.get(`${import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://vidstream-th0g.onrender.com'}/api/v1/search/search?q=${encodeURIComponent(query)}`, { 
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setVideos(Array.isArray(res.data) ? res.data : []);
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
    <div className="min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">

        {/* Header */}
        <div className="mb-10 border-b pb-6" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: 'sans-serif' }}>
            Search results for "{query}"
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Found {loading ? '...' : videos.length} matching videos
          </p>
        </div>

        {/* Results List */}
        <div className="w-full max-w-5xl">
          {loading ? (
            <div className="flex flex-col gap-6 pb-12">
              {Array.from({ length: 5 }).map((_, i) => (
                 <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 pb-12">
              {videos.map((video, i) => (
                <SearchVideoCard key={video._id} video={video} />
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
    </div>
  );
}
