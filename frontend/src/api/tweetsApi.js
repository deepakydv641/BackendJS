import axios from 'axios';

const tweetsApi = axios.create({
  baseURL: (import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://vidstream-th0g.onrender.com') + '/api/v1/tweets',
  withCredentials: true,
});

tweetsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

tweetsApi.interceptors.response.use(
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
        const { data } = await axios.post((import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://vidstream-th0g.onrender.com') + '/api/v1/users/refresh-access-token', {}, { withCredentials: true });
        const newToken = data.data?.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return tweetsApi(original);
        }
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getUserTweets = (userId) => tweetsApi.get(`/u/${userId}`);
export const getAllTweets = () => tweetsApi.get('/all');
export const createTweet = (formData) => tweetsApi.post(`/create-tweet`, formData);
export const updateTweet = (tweetId, content) => tweetsApi.patch(`/t/${tweetId}`, { Content: content });
export const deleteTweet = (tweetId) => tweetsApi.delete(`/t/${tweetId}`);

export default { getUserTweets, getAllTweets, createTweet, updateTweet, deleteTweet };
