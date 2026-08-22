import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { X, Ghost, Loader2, Home, Compass, Plus, Users, Bell, User } from 'lucide-react';
import Sidebar from './Sidebar';
import { useGhost } from '../../context/GhostContext';
import { useAuth } from '../../context/AuthContext';
import ComposePost from '../feed/ComposePost';

const DashboardLayout = () => {
  const location = useLocation();
  const { isGhostMode } = useGhost();
  const { currentUser } = useAuth();
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const isDiscover = location.pathname.startsWith('/discover');
  const isChat = location.pathname.startsWith('/chat');
  const isClubs = location.pathname.startsWith('/clubs');
  const isSettings = location.pathname.startsWith('/settings');
  const hideRightSidebar = isDiscover || isChat || isClubs || isSettings;

  return (
    /* Full-width, Edge-to-Edge Layout */
    <div className="min-h-screen w-full bg-gray-50 flex font-sans text-gray-900 pb-[72px] md:pb-0">
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-40 px-4 flex items-center justify-between">
        <Link to="/home" className="font-extrabold text-xl tracking-tight text-gray-900">CampusX</Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleGhostMode}
            className={`p-2 rounded-full transition-colors ${isGhostMode ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <Ghost className="w-5 h-5" />
          </button>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-200">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-500" />
            )}
          </Link>
        </div>
      </div>

      {/* Left Panel - Solid white, anchored to the left edge */}
      <div className="hidden md:block w-[260px] xl:w-[280px] shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 z-10">
        <Sidebar onOpenCompose={() => setIsComposeOpen(true)} />
      </div>

      {/* Center Feed/Content - Flexible width to kill empty space */}
      <main className={`flex-1 min-h-screen flex pt-14 md:pt-0 ${isChat ? '' : 'justify-center md:py-8'}`}>
        <div className={`w-full transition-all ${isChat ? 'max-w-full h-screen' : 'max-w-[1200px] px-6 lg:px-12'}`}>
          <Outlet />
        </div>
      </main>

      {/* Right Panel - Solid white, anchored to the right edge (Hidden on Discover and Chat routes) */}
      {!hideRightSidebar && (
        <aside className="hidden lg:block w-[320px] xl:w-[350px] shrink-0 bg-white border-l border-gray-200 h-screen sticky top-0 py-6 px-6 overflow-y-auto z-10">
          {/* Content stripped cleanly until backend systems for Trending/Clubs are built */}
        </aside>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-200 z-40 px-6 flex items-center justify-between pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <Link to="/home" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/home') ? 'text-black' : 'text-gray-400'}`}>
          <Home className="w-6 h-6" />
        </Link>
        <Link to="/discover" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/discover') ? 'text-black' : 'text-gray-400'}`}>
          <Compass className="w-6 h-6" />
        </Link>
        <div className="-mt-6">
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <Link to="/clubs" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/clubs') ? 'text-black' : 'text-gray-400'}`}>
          <Users className="w-6 h-6" />
        </Link>
        <Link to="/notifications" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/notifications') ? 'text-black' : 'text-gray-400'}`}>
          <Bell className="w-6 h-6" />
        </Link>
      </div>

      {/* Global Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${
            isGhostMode ? 'bg-gray-900 border-purple-500/50' : 'bg-white border-gray-200'
          }`}>
            
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isGhostMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <h3 className={`font-bold text-lg ${isGhostMode ? 'text-white' : 'text-gray-900'}`}>
                {isGhostMode ? 'Anonymous Post' : 'Create Post'}
              </h3>
              <button 
                onClick={() => setIsComposeOpen(false)}
                className={`p-2 rounded-full transition-colors ${isGhostMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body & Footer using Shared Component */}
            <div className="p-4">
              <ComposePost isModal={true} onClose={() => setIsComposeOpen(false)} />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;
