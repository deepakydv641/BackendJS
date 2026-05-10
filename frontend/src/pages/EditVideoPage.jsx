import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import videosApi from '../api/videosApi';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

export default function EditVideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  // Pre-fill form from router state if available
  useEffect(() => {
    if (location.state?.video) {
      const v = location.state.video;
      setForm({ title: v.title || '', description: v.description || '' });
      setThumbPreview(v.thumbnail || null);
    } else {
      // If user accesses /edit-video ID manually, redirect back
      toast.error("Video details not found. Please click 'Edit' from your dashboard.");
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleThumbChange = (file) => {
    if (!file) return;
    setThumbnail(file);
    const url = URL.createObjectURL(file);
    setThumbPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title && !form.description && !thumbnail) {
      toast.error('Please update at least one field');
      return;
    }
    
    setLoading(true);
    setProgress(0);

    const data = new FormData();
    if (form.title) data.append('title', form.title);
    if (form.description) data.append('description', form.description);
    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      await videosApi.patch(`/update-video/${videoId}`, data, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      toast.success('Video updated successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const DropZone = ({ label, id, accept, file, preview, onFile, hint }) => (
    <div>
      <label className="form-label">{label}</label>
      <label
        htmlFor={id}
        className="block cursor-pointer transition-all duration-300"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
      >
        <div
          className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center min-h-[160px] transition-all duration-300"
          style={{
            border: `2px dashed ${dragOver || file ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`,
            background: file
              ? 'rgba(124,58,237,0.08)'
              : dragOver
                ? 'rgba(124,58,237,0.06)'
                : 'rgba(255,255,255,0.02)',
            boxShadow: file ? '0 0 20px rgba(124,58,237,0.15)' : 'none',
          }}
        >
          {preview ? (
            <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          ) : null}
          <div className="relative z-10 flex flex-col items-center gap-3" style={{ opacity: preview ? 0 : 1 }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: file ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${file ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {file ? (
                <svg className="w-6 h-6" style={{ color: '#a78bfa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-6 h-6" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: file ? '#a78bfa' : 'var(--text-secondary)' }}>
                {file ? file.name : 'Drop new thumbnail or click to browse'}
              </p>
              {!file && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
            </div>
          </div>
          {preview && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-20">
              <p className="text-white text-sm font-semibold">Change Thumbnail</p>
            </div>
          )}
        </div>
        <input id={id} type="file" accept={accept} className="sr-only"
          disabled={loading}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />
      </label>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
      {loading && (
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      )}

      <div className="max-w-2xl mx-auto px-4 py-10 animate-slide-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Edit <span className="gradient-text">Video Details</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Update title, description, or thumbnail for your video
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="form-label">Title</label>
            <input type="text" name="title" value={form.title}
              onChange={handleChange} placeholder="Update title…"
              className="input-field" disabled={loading} required
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description}
              onChange={handleChange} rows={4}
              placeholder="Update description…"
              className="input-field resize-none leading-relaxed"
              disabled={loading} required
            />
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-1 gap-4">
            <DropZone
              label="Thumbnail (Optional)" id="thumbInput" accept="image/*"
              file={thumbnail} preview={thumbPreview}
              onFile={handleThumbChange}
              hint="JPG, PNG, WebP (16:9 recommended)"
            />
          </div>

          {/* Upload progress */}
          {loading && progress > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>Updating…</span><span>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #4f46e5)' }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            {loading ? (
              <><Spinner size="sm" /><span>Updating…</span></>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
