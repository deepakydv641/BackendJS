import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import videosApi from '../api/videosApi';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

export default function UploadVideoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !videoFile || !thumbnail) {
      toast.error('Please fill all required fields and select files');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.duration) data.append('duration', formData.duration);
    data.append('videoFile', videoFile);
    data.append('thumbnail', thumbnail);

    try {
      await videosApi.post('/upload-video', data);
      toast.success('Video uploaded successfully!');
      navigate('/dashboard'); // Go back to dashboard/home page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b]">
      <Navbar />
      
      <div className="max-w-xl mx-auto px-4 py-8 animate-slide-up">
        <div className="card p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-1">Upload Video</h1>
            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Share your latest video with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Title *</label>
              <div className="relative group">
                <input type="text" name="title" required value={formData.title} onChange={handleChange}
                  placeholder="Enter video title"
                  className="input-field pl-11"
                  disabled={loading} />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                  {/* Title Icon */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Description *</label>
              <textarea name="description" required value={formData.description} onChange={handleChange}
                placeholder="What is your video about?" rows={3}
                className="input-field resize-none py-3"
                disabled={loading} />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Duration (Seconds)</label>
              <div className="relative group">
                <input type="number" name="duration" value={formData.duration} onChange={handleChange}
                  placeholder="e.g. 120" min="0"
                  className="input-field pl-11"
                  disabled={loading} />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                  {/* Clock Icon */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              {/* Video File */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Video File *</label>
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-zinc-900 flex flex-col items-center justify-center p-6 text-center group cursor-pointer h-32">
                  <input type="file" accept="video/*,image/*" required onChange={handleVideoChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={loading} />
                  <svg className={`w-8 h-8 mb-2 transition-colors ${videoFile ? 'text-green-500' : 'text-gray-400 dark:text-zinc-500 group-hover:text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-semibold text-gray-600 dark:text-zinc-400 px-2 truncate w-full">
                    {videoFile ? videoFile.name : 'Select Video'}
                  </p>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1">Thumbnail *</label>
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-zinc-900 flex flex-col items-center justify-center p-6 text-center group cursor-pointer h-32">
                  <input type="file" accept="image/*" required onChange={handleThumbnailChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={loading} />
                  <svg className={`w-8 h-8 mb-2 transition-colors ${thumbnail ? 'text-green-500' : 'text-gray-400 dark:text-zinc-500 group-hover:text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-semibold text-gray-600 dark:text-zinc-400 px-2 truncate w-full">
                    {thumbnail ? thumbnail.name : 'Select Image'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary mt-4 w-full flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
