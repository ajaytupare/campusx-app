import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X, Image as ImageIcon, Smile, Ghost, Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { useGhost } from '../../context/GhostContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DashboardLayout = () => {
  const location = useLocation();
  const { isGhostMode } = useGhost();
  const { currentUser } = useAuth();
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const isDiscover = location.pathname.startsWith('/discover');
  const isChat = location.pathname.startsWith('/chat');
  const isClubs = location.pathname.startsWith('/clubs');
  const isSettings = location.pathname.startsWith('/settings');
  const hideRightSidebar = isDiscover || isChat || isClubs || isSettings;

  const handleGlobalPost = async () => {
    if (!postText.trim() || !currentUser) return;
    
    setIsPosting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        content: postText.trim(),
        authorId: currentUser.uid,
        authorName: isGhostMode ? 'Ghost' : (currentUser.displayName || 'Campus Student'),
        authorAvatar: isGhostMode ? null : (currentUser.photoURL || null),
        type: isGhostMode ? 'ghost' : 'text',
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0
      });
      setPostText('');
      setIsComposeOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

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

            {/* Modal Body */}
            <div className="p-5">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-xl transition-colors ${
                  isGhostMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isGhostMode ? (
                    <Ghost className="w-6 h-6" />
                  ) : (
                    currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                      currentUser?.displayName?.charAt(0).toUpperCase() || 'U'
                    )
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <textarea 
                    autoFocus
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder={isGhostMode ? "Share an anonymous secret to campus..." : "What's happening on campus?"}
                    className={`w-full bg-transparent border-none text-lg outline-none resize-none min-h-[120px] font-medium transition-colors ${
                      isGhostMode ? 'text-white placeholder-purple-300' : 'text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex items-center justify-between p-4 border-t ${isGhostMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex gap-2">
                <button className={`p-2 rounded-full transition-colors ${
                  isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-200'
                }`}>
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-full transition-colors ${
                  isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-200'
                }`}>
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleGlobalPost}
                disabled={isPosting || !postText.trim()}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isGhostMode ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isGhostMode ? 'Post as Ghost' : 'Post'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;
