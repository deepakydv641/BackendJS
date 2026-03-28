import axios from 'axios';

const likesApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1/likes',
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
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          'http://localhost:8000/api/v1/users/refresh-access-token',
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
