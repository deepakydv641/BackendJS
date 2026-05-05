import axios from 'axios';

const forgotPasswordApi = axios.create({
  baseURL: 'https://vidstream-th0g.onrender.com/api/v1/users',
  withCredentials: true,
});

export const sendForgotPasswordOtp = (emailId) =>
  forgotPasswordApi.post('/forgot-password', { emailId });

export const verifyOtp = (emailId, OTP) =>
  forgotPasswordApi.post('/verify-otp', { emailId, OTP });

export const resetPassword = (emailId, newpassword) =>
  forgotPasswordApi.post('/reset-password', { emailId, newpassword });

export default forgotPasswordApi;
