import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from './LoadingState';

export default function ProtectedRoute({ children, requireInstructor = false, requireCoordinator = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState label="Preparing your workspace..." fullscreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireInstructor && !user.isInstructor) {
    return <Navigate to="/status" replace />;
  }

  if (requireCoordinator && user.isInstructor) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
