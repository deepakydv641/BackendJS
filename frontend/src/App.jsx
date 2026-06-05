import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
  if (loading) return <div className="flex-1 flex items-center justify-center"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
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
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route path="home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
          <Route path="update-account" element={<PrivateRoute><UpdateAccountPage /></PrivateRoute>} />
          <Route path="upload-video" element={<PrivateRoute><UploadVideoPage /></PrivateRoute>} />
          <Route path="edit-video/:videoId" element={<PrivateRoute><EditVideoPage /></PrivateRoute>} />
          <Route path="video/:videoId" element={<PrivateRoute><VideoDetailPage /></PrivateRoute>} />
          <Route path="channel/:username" element={<PrivateRoute><ChannelPage /></PrivateRoute>} />
          <Route path="search/:query" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="liked-videos" element={<PrivateRoute><LikedVideosPage /></PrivateRoute>} />
          <Route path="history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
