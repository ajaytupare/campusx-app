import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/auth/Landing';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Chat from './pages/chat/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main App Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
