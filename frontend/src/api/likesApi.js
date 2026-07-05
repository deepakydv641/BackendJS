import axios from 'axios';

const likesApi = axios.create({
  baseURL: (import.meta.env.MODE === 'development' ? 'http://localhost' : 'https://vidstream-th0g.onrender.com') + '/api/v1/likes',
  withCredentials: true,
});

likesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

likesApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    
    // Handle rate limit errors (429)
    if (error.response?.status === 429) {
      const message = error.response?.data?.message || 'Too many requests. Please try again later.';
      // Import toast dynamically to avoid circular dependency
      const { default: toast } = await import('react-hot-toast');
      toast.error(message, { duration: 5000 });
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          (import.meta.env.MODE === 'development' ? 'http://localhost' : 'https://vidstream-th0g.onrender.com') + '/api/v1/users/refresh-access-token',
          {},
          { withCredentials: true }
        );
        const newToken = data.data?.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return likesApi(original);
        }
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const toggleVideoLike = (videoId) => likesApi.post(`/v/${videoId}`);
export const toggleCommentLike = (commentId) => likesApi.post(`/c/${commentId}`);
export const toggleTweetLike = (tweetId) => likesApi.post(`/t/${tweetId}`);
export const getLikedVideos = () => likesApi.get('/liked-videos');

export default likesApi;
