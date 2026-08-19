import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { Image as ImageIcon, Smile, Send } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreatePost = ({ onPostCreated }) => {
  const { userProfile, currentUser } = useAuth();
  const { isGhostMode } = useGhost();
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
    <div className={`rounded-[24px] p-5 shadow-sm border transition-colors duration-300
      ${isGhostMode ? 'bg-[var(--cx-ghost-start)]/5 border-[var(--cx-ghost-start)]/20 shadow-purple-500/5' : 'bg-[var(--cx-bg-surface)] border-[var(--cx-text-muted)]/10'}`}>
      
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-xl transition-colors
          ${isGhostMode ? 'bg-[var(--cx-ghost-start)]/10 text-[var(--cx-ghost-start)]' : 'bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/10 text-[var(--cx-primary)]'}`}>
          {isGhostMode ? '👻' : (
            <span className="font-bold text-sm">
              {userProfile?.name?.charAt(0) || 'S'}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <textarea 
            placeholder={isGhostMode ? "Share a secret anonymously..." : "What's happening on campus?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            className={`w-full bg-transparent border-none text-[15px] outline-none resize-none min-h-[60px] font-medium
              ${isGhostMode ? 'text-[var(--cx-text-main)] placeholder:text-[var(--cx-ghost-start)]/50' : 'text-[var(--cx-text-main)] placeholder:text-[var(--cx-text-muted)]/50'}`}
          />
          
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--cx-text-muted)]/10">
            <div className="flex gap-2">
              <button className={`p-2 rounded-xl transition-colors ${isGhostMode ? 'text-[var(--cx-ghost-start)]/70 hover:bg-[var(--cx-ghost-start)]/10' : 'text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)]'}`}>
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-xl transition-colors ${isGhostMode ? 'text-[var(--cx-ghost-start)]/70 hover:bg-[var(--cx-ghost-start)]/10' : 'text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)]'}`}>
                <Smile className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-[14px] transition-transform active:scale-95
                ${!content.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
                ${isGhostMode ? 'bg-[var(--cx-ghost-start)] text-white hover:shadow-purple-500/30' : 'bg-[var(--cx-primary)] text-white hover:shadow-indigo-500/30'}`}
            >
              {loading ? 'Posting...' : (
                <>Post <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
