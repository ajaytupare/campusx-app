import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';

import Landing from './pages/auth/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

import Dashboard from './pages/Dashboard';
import CollegesDirectory from './pages/colleges/CollegesDirectory';
import CollegeProfile from './pages/colleges/CollegeProfile';
import TeachersDirectory from './pages/teachers/TeachersDirectory';
import TeacherProfile from './pages/teachers/TeacherProfile';
import Friends from './pages/friends/Friends';
import ChatList from './pages/chat/ChatList';
import ChatConversation from './pages/chat/ChatConversation';
import CommunitiesDirectory from './pages/communities/CommunitiesDirectory';
import CommunityProfile from './pages/communities/CommunityProfile';
import EventsDirectory from './pages/events/EventsDirectory';
import EventProfile from './pages/events/EventProfile';
import OpportunitiesDirectory from './pages/opportunities/OpportunitiesDirectory';
import OpportunityProfile from './pages/opportunities/OpportunityProfile';
import UserProfile from './pages/profile/UserProfile';
import Settings from './pages/settings/Settings';

// Simple placeholder for unbuilt pages
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-[var(--cx-bg-surface)] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
    <h2 className="text-2xl font-bold text-[var(--cx-text-main)] mb-2">{title}</h2>
    <p className="text-[var(--cx-text-muted)] font-medium">This page is under construction.</p>
  </div>
);

const AuthGuard = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicGuard = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If user is already logged in, redirect them to home instead of showing landing/login
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicGuard><Landing /></PublicGuard>} />
        <Route path="/login" element={<PublicGuard><Login /></PublicGuard>} />
        <Route path="/register" element={<PublicGuard><Register /></PublicGuard>} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Dashboard Routes */}
        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/discover" element={<Placeholder title="Discover" />} />
          <Route path="/colleges" element={<CollegesDirectory />} />
          <Route path="/colleges/:id" element={<CollegeProfile />} />
          
          <Route path="/teachers" element={<TeachersDirectory />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          
          <Route path="/friends" element={<Friends />} />
          
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:conversationId" element={<ChatConversation />} />
          
          <Route path="/communities" element={<CommunitiesDirectory />} />
          <Route path="/communities/:communityId" element={<CommunityProfile />} />
          
          <Route path="/events" element={<EventsDirectory />} />
          <Route path="/events/:eventId" element={<EventProfile />} />
          
          <Route path="/opportunities" element={<OpportunitiesDirectory />} />
          <Route path="/opportunities/:oppId" element={<OpportunityProfile />} />
          
          <Route path="/profile/:userId" element={<UserProfile />} />
          
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/*" element={<Settings />} />
          
          <Route path="/ghost" element={<Placeholder title="Ghost Mode Feed" />} />
          <Route path="/notifications" element={<Placeholder title="Notifications" />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

