import axios from 'axios';

const usersApi = axios.create({
  baseURL: 'https://vidstream-th0g.onrender.com/api/v1/users',
  withCredentials: true,
});

// Attach access token from localStorage if present
usersApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reuse the same logic for token refresh as in other APIs
usersApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          'https://vidstream-th0g.onrender.com/api/v1/users/refresh-access-token',
          {},
          { withCredentials: true }
        );
        const newToken = data.data?.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return usersApi(original);
        }
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getChannelProfile = (username) => usersApi.get(`/c/${username}`);
// export const updateAccountDetails = (data) => usersApi.patch('/update-account', data);
// etc...

export default usersApi;
