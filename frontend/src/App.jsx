import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import UpdateAccountPage from './pages/UpdateAccountPage';
import UploadVideoPage from './pages/UploadVideoPage';
import EditVideoPage from './pages/EditVideoPage';
import ChannelPage from './pages/ChannelPage';
import VideoDetailPage from './pages/VideoDetailPage';
import SearchPage from './pages/SearchPage';
import LikedVideosPage from './pages/LikedVideosPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HistoryPage from './pages/HistoryPage';
import Spinner from './components/Spinner';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  return !user ? children : <Navigate to="/home" replace />;
}

import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/home" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
      <Route path="/change-password" element={<PrivateRoute><Layout><ChangePasswordPage /></Layout></PrivateRoute>} />
      <Route path="/update-account" element={<PrivateRoute><Layout><UpdateAccountPage /></Layout></PrivateRoute>} />
      <Route path="/upload-video" element={<PrivateRoute><Layout><UploadVideoPage /></Layout></PrivateRoute>} />
      <Route path="/edit-video/:videoId" element={<PrivateRoute><Layout><EditVideoPage /></Layout></PrivateRoute>} />
      <Route path="/video/:videoId" element={<PrivateRoute><Layout><VideoDetailPage /></Layout></PrivateRoute>} />
      <Route path="/channel/:username" element={<PrivateRoute><Layout><ChannelPage /></Layout></PrivateRoute>} />
      <Route path="/search/:query" element={<PrivateRoute><Layout><SearchPage /></Layout></PrivateRoute>} />
      <Route path="/liked-videos" element={<PrivateRoute><Layout><LikedVideosPage /></Layout></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><Layout><HistoryPage /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
