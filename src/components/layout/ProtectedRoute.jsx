import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a clean loading spinner while checking auth status to prevent the blank screen
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500 tracking-wide">Loading CampusX...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Not logged in? Boot them to the landing page immediately
    return <Navigate to="/" replace />;
  }

  // Logged in? Allow them to see the page
  return children;
};

export default ProtectedRoute;
