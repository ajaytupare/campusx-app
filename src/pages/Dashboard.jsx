import { Image as ImageIcon, Smile, MessageCircle, Heart, Share2, Ghost } from 'lucide-react';
import { useGhost } from '../context/GhostContext';

const Dashboard = () => {
  const { isGhostMode } = useGhost();

  return (
    <div className="flex flex-col gap-6">
      
      {/* Post Composer - Dynamically reacts to Ghost Mode */}
      <div className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all duration-300 ${
        isGhostMode 
          ? 'bg-gray-900 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex gap-4">
          
          {/* Avatar Area */}
          <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center transition-colors ${
            isGhostMode ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
            {isGhostMode ? (
              <Ghost className="w-6 h-6" />
            ) : (
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" alt="Me" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Input Area */}
          <div className="flex-1">
            <textarea 
              placeholder={isGhostMode ? "Share an anonymous secret to campus..." : "What's happening on campus?"}
              className={`w-full bg-transparent border-none text-base outline-none resize-none min-h-[60px] font-medium pt-2 transition-colors ${
                isGhostMode ? 'text-white placeholder-purple-300' : 'text-gray-900 placeholder-gray-400'
              }`}
            />
            <div className={`flex items-center justify-between pt-3 border-t mt-2 transition-colors ${
              isGhostMode ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <div className="flex gap-2">
                <button className={`p-2 rounded-full transition-colors ${
                  isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-full transition-colors ${
                  isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className={`px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-sm ${
                isGhostMode ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-black text-white hover:bg-gray-800'
              }`}>
                {isGhostMode ? 'Post as Ghost' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Feed</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      {/* Sample Post */}
      <article className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">Sarah Jenkins</h4>
            <p className="text-xs font-medium text-gray-500">Biology '25 &bull; 2h ago</p>
          </div>
        </div>
        
        <p className="text-sm leading-relaxed text-gray-800 mb-4">
          Just finished my final presentation for Bio 401. So relieved! Anyone want to grab coffee at the union to celebrate? ☕️
        </p>

        <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            <Heart className="w-[18px] h-[18px]" /> 24
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            <MessageCircle className="w-[18px] h-[18px]" /> 5
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            <Share2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </article>

    </div>
  );
};

export default Dashboard;
