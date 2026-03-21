import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import videosApi from '../api/videosApi';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await videosApi.get('/all-videos');
        setVideos(data.data || []);
      } catch (error) {
        toast.error('Failed to load videos');
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Explore Videos</h1>
            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Discover wonderful videos from our community</p>
          </div>
          <Link to="/upload-video" className="btn-primary hidden sm:flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Upload
          </Link>
        </div>
        
        {loadingVideos ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : videos?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pb-12">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center card max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1">No videos found</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6 max-w-sm mx-auto">Be the first to share your moments with the community.</p>
            <Link to="/upload-video" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Upload First Video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
