import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { Image as ImageIcon, BarChart2 } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreatePost = ({ onPostCreated }) => {
  const { userProfile, currentUser } = useAuth();
  const { isGhostMode, toggleGhostMode } = useGhost();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !currentUser) return;
    setLoading(true);

    try {
      const storedProfile = JSON.parse(localStorage.getItem('cx_current_user_profile')) || {};
      
      const newPost = {
        content: content.trim(),
        // PRIVACY ENFORCEMENT: Completely strip real identity if in Ghost Mode
        authorId: isGhostMode ? null : currentUser.uid,
        authorName: isGhostMode ? null : (storedProfile.name || userProfile?.name || 'Student'),
        authorAvatar: isGhostMode ? null : (storedProfile.avatar || null),
        authorCollege: isGhostMode ? null : (storedProfile.location || userProfile?.college || ''),
        createdAt: new Date().toISOString(),
        likes: 0,
        commentsCount: 0,
        isGhost: isGhostMode,
        tags: []
      };

      // Add to Firestore
      await addDoc(collection(db, 'posts'), newPost);

      setContent('');
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
      
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-[var(--cx-bg-base)] border border-black/[0.06]">
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Me" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 min-w-0">
          <textarea 
            placeholder="What's happening on campus?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            className="w-full bg-transparent border-none text-[15px] outline-none resize-none min-h-[60px] font-medium text-[var(--cx-text-main)] placeholder:text-[var(--cx-text-muted)] mt-1"
          />
          
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-black/[0.04]">
            {/* Left Icons */}
            <div className="flex gap-1.5">
              <button className="p-2 rounded-lg text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-colors border border-black/10">
                <ImageIcon className="w-[18px] h-[18px]" />
              </button>
              <button className="p-2 rounded-lg text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-colors border border-black/10">
                <BarChart2 className="w-[18px] h-[18px]" />
              </button>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Me / Ghost Toggle */}
              <div className="flex bg-white rounded-lg p-0.5 border border-black/10">
                <button 
                  onClick={() => { if(isGhostMode) toggleGhostMode() }}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-bold flex items-center gap-1.5 transition-all
                    ${!isGhostMode ? 'bg-black/[0.04] text-[var(--cx-text-main)]' : 'text-[var(--cx-text-muted)] hover:bg-black/[0.02]'}`}
                >
                  <span className="text-[14px]">👤</span> Me
                </button>
                <button 
                  onClick={() => { if(!isGhostMode) toggleGhostMode() }}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-bold flex items-center gap-1.5 transition-all
                    ${isGhostMode ? 'bg-black/[0.04] text-[var(--cx-text-main)]' : 'text-[var(--cx-text-muted)] hover:bg-black/[0.02]'}`}
                >
                  <span className="text-[14px]">👻</span> Ghost
                </button>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className={`px-6 py-2 rounded-lg font-bold text-[14px] transition-all bg-[var(--cx-primary)] text-white
                  ${(!content.trim() || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`}
              >
                {loading ? '...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
