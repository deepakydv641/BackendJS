import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';
import Layout from './components/Layout';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));
const UpdateAccountPage = lazy(() => import('./pages/UpdateAccountPage'));
const UploadVideoPage = lazy(() => import('./pages/UploadVideoPage'));
const EditVideoPage = lazy(() => import('./pages/EditVideoPage'));
const ChannelPage = lazy(() => import('./pages/ChannelPage'));
const VideoDetailPage = lazy(() => import('./pages/VideoDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const LikedVideosPage = lazy(() => import('./pages/LikedVideosPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

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

export default function App() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
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
    </Suspense>
  );
}
