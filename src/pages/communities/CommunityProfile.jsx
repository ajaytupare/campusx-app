import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { ArrowLeft, UsersRound, Hash, Globe, Lock, Plus, Send, Image as ImageIcon, Smile, MoreHorizontal } from 'lucide-react';

const CommunityProfile = () => {
  const { communityId } = useParams();
  const { userProfile, currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const fetchCommunityAndPosts = () => {
    const allComms = JSON.parse(localStorage.getItem('cx_mock_communities') || '[]');
    const foundComm = allComms.find(c => c.id === communityId);
    setCommunity(foundComm);

    const allPosts = JSON.parse(localStorage.getItem('cx_mock_community_posts') || '[]');
    const commPosts = allPosts.filter(p => p.communityId === communityId);
    commPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(commPosts);
  };

  useEffect(() => {
    fetchCommunityAndPosts();
    // Simulate join state
    const joinedStore = JSON.parse(localStorage.getItem('cx_mock_joined_comms') || '{}');
    if (joinedStore[communityId]) setIsJoined(true);
  }, [communityId]);

  const handleJoin = () => {
    const joinedStore = JSON.parse(localStorage.getItem('cx_mock_joined_comms') || '{}');
    joinedStore[communityId] = true;
    localStorage.setItem('cx_mock_joined_comms', JSON.stringify(joinedStore));
    setIsJoined(true);
    
    // Bump member count mock
    const allComms = JSON.parse(localStorage.getItem('cx_mock_communities') || '[]');
    const cIdx = allComms.findIndex(c => c.id === communityId);
    if(cIdx > -1) {
      allComms[cIdx].members += 1;
      localStorage.setItem('cx_mock_communities', JSON.stringify(allComms));
      setCommunity(allComms[cIdx]);
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const allPosts = JSON.parse(localStorage.getItem('cx_mock_community_posts') || '[]');
    
    const newPost = {
      id: 'cpost_' + Date.now(),
      communityId: communityId,
      text: newPostText.trim(),
      createdAt: new Date().toISOString(),
      isGhost: isGhostMode,
      // PRIVACY ENFORCEMENT: Strip data if Ghost
      authorId: isGhostMode ? null : currentUser.uid,
      authorName: isGhostMode ? null : (userProfile?.name || 'Student'),
    };

    allPosts.push(newPost);
    localStorage.setItem('cx_mock_community_posts', JSON.stringify(allPosts));
    
    setNewPostText('');
    fetchCommunityAndPosts();
  };

  if (!community) {
    return <div className="p-8 text-center text-[var(--cx-text-muted)]">Loading community...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto gap-6 pb-12">
      
      <Link to="/communities" className="inline-flex items-center gap-2 text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-colors font-bold text-[14px] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      {/* Hero Profile */}
      <div className="bg-[var(--cx-bg-surface)] rounded-[32px] p-8 shadow-sm border border-[var(--cx-text-muted)]/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[var(--cx-primary)]/20 to-purple-500/20 opacity-50"></div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-end mt-12">
          <div className="w-24 h-24 rounded-[24px] bg-white border-4 border-[var(--cx-bg-surface)] shadow-md flex items-center justify-center text-4xl font-black text-[var(--cx-primary)] shrink-0">
            <Hash className="w-12 h-12 text-[var(--cx-primary)]/50" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 bg-[var(--cx-bg-base)] px-2.5 py-1 rounded-lg border border-[var(--cx-text-muted)]/10 w-fit">
                {community.isPrivate ? <Lock className="w-3.5 h-3.5 text-zinc-500" /> : <Globe className="w-3.5 h-3.5 text-zinc-500" />}
                <span className="text-[11px] font-black text-zinc-500 tracking-wider uppercase">
                  {community.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--cx-text-main)] tracking-tight mb-2 leading-tight">
              {community.name}
            </h1>
            <p className="text-[var(--cx-text-muted)] text-[15px] font-medium max-w-2xl mb-4">
              {community.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[var(--cx-text-muted)] text-[14px] font-semibold">
              <div className="flex items-center gap-1.5"><UsersRound className="w-4 h-4" /> {community.members.toLocaleString()} Members</div>
            </div>
          </div>
          
          <div className="shrink-0 w-full sm:w-auto">
            {!isJoined ? (
              <button onClick={handleJoin} className="w-full sm:w-auto px-6 py-3 rounded-[16px] font-bold flex items-center justify-center gap-2 text-[14px] bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
                <Plus className="w-4 h-4" /> Join
              </button>
            ) : (
              <button disabled className="w-full sm:w-auto px-6 py-3 rounded-[16px] font-bold flex items-center justify-center gap-2 text-[14px] bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] border border-[var(--cx-text-muted)]/10 cursor-default">
                Joined
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Post Box */}
          {(isJoined || !community.isPrivate) && (
            <div className={`rounded-[24px] p-5 shadow-sm border transition-colors duration-300
              ${isGhostMode ? 'bg-[var(--cx-ghost-start)]/5 border-[var(--cx-ghost-start)]/20' : 'bg-[var(--cx-bg-surface)] border-[var(--cx-text-muted)]/10'}`}>
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
                    placeholder={isGhostMode ? "Post anonymously to this community..." : `Post to ${community.name}...`}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
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
                      onClick={handlePost}
                      disabled={!newPostText.trim()}
                      className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-[14px] transition-transform active:scale-95
                        ${!newPostText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
                        ${isGhostMode ? 'bg-[var(--cx-ghost-start)] text-white hover:shadow-purple-500/30' : 'bg-[var(--cx-primary)] text-white hover:shadow-indigo-500/30'}`}
                    >
                      Post <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-[24px] border border-[var(--cx-text-muted)]/10">
                No posts yet in this community.
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-[var(--cx-bg-surface)] rounded-[24px] p-5 shadow-sm border border-[var(--cx-text-muted)]/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-[var(--cx-text-muted)]/10
                        ${post.isGhost ? 'bg-zinc-900 text-lg' : 'bg-[var(--cx-bg-base)]'}`}>
                        {post.isGhost ? '👻' : (
                          <span className="font-bold text-[var(--cx-primary)] text-sm">
                            {(post.authorName || 'S').charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] text-[var(--cx-text-main)] flex items-center gap-2 leading-tight">
                          {post.isGhost ? `Ghost #${post.id.substring(6, 10).toUpperCase()}` : post.authorName}
                          {post.isGhost && (
                            <span className="bg-[var(--cx-ghost-start)]/10 text-[var(--cx-ghost-start)] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold">
                              Incognito
                            </span>
                          )}
                        </h4>
                        <span className="text-[12px] font-semibold text-[var(--cx-text-muted)]">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)] p-1.5 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[15px] text-[var(--cx-text-main)] leading-relaxed font-medium whitespace-pre-wrap ml-[52px]">
                    {post.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--cx-bg-surface)] rounded-[24px] p-6 shadow-sm border border-[var(--cx-text-muted)]/10 sticky top-6">
            <h3 className="font-extrabold text-[16px] text-[var(--cx-text-main)] mb-4">About Community</h3>
            <p className="text-[14px] text-[var(--cx-text-muted)] font-medium mb-6 leading-relaxed">
              {community.description}
            </p>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--cx-text-muted)] font-semibold">Privacy</span>
                <span className="font-bold text-[var(--cx-text-main)] flex items-center gap-1.5">
                  {community.isPrivate ? <><Lock className="w-3.5 h-3.5" /> Private</> : <><Globe className="w-3.5 h-3.5" /> Public</>}
                </span>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--cx-text-muted)] font-semibold">Members</span>
                <span className="font-bold text-[var(--cx-text-main)]">{community.members.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--cx-text-muted)] font-semibold">Created</span>
                <span className="font-bold text-[var(--cx-text-main)]">Aug 2026</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CommunityProfile;
