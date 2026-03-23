import axios from 'axios';

const commentsApi = axios.create({
  baseURL: '/api/v1/comments',
  withCredentials: true,
});

// Attach access token from localStorage if present
commentsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reuse the same logic for token refresh as in other APIs
commentsApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          '/api/v1/users/refresh-access-token',
          {},
          { withCredentials: true }
        );
        const newToken = data.data?.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return commentsApi(original);
        }
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getVideoComments = (videoId) => {
    return commentsApi.get(`/v/${videoId}`);
};

export const addComment = (videoId, content) => {
    return commentsApi.post(`/v/${videoId}`, { Content: content });
};

export const updateComment = (commentId, content) => {
    return commentsApi.patch(`/c/${commentId}`, { Content: content });
};

export const deleteComment = (commentId) => {
    return commentsApi.delete(`/c/${commentId}`);
};

export default {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
