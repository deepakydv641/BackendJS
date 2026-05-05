import axios from 'axios';

const forgotPasswordApi = axios.create({
  baseURL: (import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://vidstream-th0g.onrender.com') + '/api/v1/users',
  withCredentials: true,
  timeout: 120000, // 2 minutes to allow Render free tier to wake up
});

export const sendForgotPasswordOtp = (emailId) =>
  forgotPasswordApi.post('/forgot-password', { emailId });

export const verifyOtp = (emailId, OTP) =>
  forgotPasswordApi.post('/verify-otp', { emailId, OTP });

export const resetPassword = (emailId, newpassword) =>
  forgotPasswordApi.post('/reset-password', { emailId, newpassword });

export default forgotPasswordApi;
