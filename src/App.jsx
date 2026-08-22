import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Landing from './pages/auth/Landing';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import DiscoverDetail from './pages/discover/DiscoverDetail';
import Chat from './pages/chat/Chat';
import UserProfile from './pages/profile/UserProfile';
import Clubs from './pages/communities/Clubs';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Main App Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/discover/:type/:id" element={<DiscoverDetail />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:uid" element={<UserProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
