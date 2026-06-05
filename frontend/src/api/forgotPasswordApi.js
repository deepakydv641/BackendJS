import axios from 'axios';

const forgotPasswordApi = axios.create({
  baseURL: (import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://vidstream-th0g.onrender.com') + '/api/v1/users',
  withCredentials: true,
  timeout: 120000, // 2 minutes to allow Render free tier to wake up
});

// Add response interceptor for rate limit handling
forgotPasswordApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Handle rate limit errors (429)
    if (error.response?.status === 429) {
      const message = error.response?.data?.message || 'Too many requests. Please try again later.';
      // Import toast dynamically to avoid circular dependency
      const { default: toast } = await import('react-hot-toast');
      toast.error(message, { duration: 5000 });
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const sendForgotPasswordOtp = (emailId) =>
  forgotPasswordApi.post('/forgot-password', { emailId });

export const verifyOtp = (emailId, OTP) =>
  forgotPasswordApi.post('/verify-otp', { emailId, OTP });

export const resetPassword = (emailId, newpassword) =>
  forgotPasswordApi.post('/reset-password', { emailId, newpassword });

export default forgotPasswordApi;
