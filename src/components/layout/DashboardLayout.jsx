import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X, Ghost, Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { useGhost } from '../../context/GhostContext';
import ComposePost from '../feed/ComposePost';

const DashboardLayout = () => {
  const location = useLocation();
  const { isGhostMode } = useGhost();
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const isDiscover = location.pathname.startsWith('/discover');
  const isChat = location.pathname.startsWith('/chat');
  const isClubs = location.pathname.startsWith('/clubs');
  const isSettings = location.pathname.startsWith('/settings');
  const hideRightSidebar = isDiscover || isChat || isClubs || isSettings;

  return (
    /* Full-width, Edge-to-Edge Layout */
    <div className="min-h-screen w-full bg-gray-50 flex font-sans text-gray-900">
      
      {/* Left Panel - Solid white, anchored to the left edge */}
      <div className="hidden md:block w-[260px] xl:w-[280px] shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 z-10">
        <Sidebar onOpenCompose={() => setIsComposeOpen(true)} />
      </div>

      {/* Center Feed/Content - Flexible width to kill empty space */}
      <main className={`flex-1 min-h-screen flex ${isChat ? '' : 'justify-center py-8'}`}>
        <div className={`w-full transition-all ${isChat ? 'max-w-full h-screen' : 'max-w-[1200px] px-6 lg:px-12'}`}>
          <Outlet />
        </div>
      </main>

      {/* Right Panel - Solid white, anchored to the right edge (Hidden on Discover and Chat routes) */}
      {!hideRightSidebar && (
        <aside className="hidden lg:block w-[320px] xl:w-[350px] shrink-0 bg-white border-l border-gray-200 h-screen sticky top-0 py-6 px-6 overflow-y-auto z-10">
          {/* Placeholder for Widgets (Trending, Events, Search) */}
          <div className="flex flex-col gap-8">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Trending on Campus</h3>
              <div className="space-y-3">
                <div className="cursor-pointer">
                  <p className="text-xs text-gray-500 font-medium">Sports</p>
                  <p className="text-sm font-bold text-gray-900">Homecoming Game</p>
                </div>
                <div className="cursor-pointer">
                  <p className="text-xs text-gray-500 font-medium">Academics</p>
                  <p className="text-sm font-bold text-gray-900">Finals Schedule Released</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

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
