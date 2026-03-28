import axios from 'axios';

const tweetsApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1/tweets',
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
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post('http://localhost:8000/api/v1/users/refresh-access-token', {}, { withCredentials: true });
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
