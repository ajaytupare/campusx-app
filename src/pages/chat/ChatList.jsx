import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { MessageSquare, Ghost, Search, Edit } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: 'conv_1', otherUserId: 'u1', otherUserName: 'Sarah Connor', lastMessage: 'Are we still meeting for the study group?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), unread: 2 },
  { id: 'conv_2', otherUserId: 'u3', otherUserName: 'Emily Chen', lastMessage: 'Thanks for the notes!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), unread: 0 },
  { id: 'conv_3', otherUserId: 'u6', otherUserName: 'David Kim', lastMessage: 'Yeah, the midterm was brutal.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), unread: 0 },
];

const ChatList = () => {
  const { currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let storedConvs = JSON.parse(localStorage.getItem('cx_mock_conversations') || '[]');
    if (storedConvs.length === 0) {
      storedConvs = MOCK_CONVERSATIONS;
      localStorage.setItem('cx_mock_conversations', JSON.stringify(storedConvs));
    }
    setConversations(storedConvs);
  }, []);

  const filteredConversations = conversations.filter(c => 
    c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // GHOST RESTRICTION UI
  if (isGhostMode) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-100px)] max-w-2xl mx-auto text-center px-4">
        <div className="w-24 h-24 bg-[var(--cx-ghost-start)]/10 rounded-[32px] flex items-center justify-center mb-6">
          <Ghost className="w-12 h-12 text-[var(--cx-ghost-start)]" />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-4">
          Chat is Disabled
        </h1>
        <p className="text-[var(--cx-text-muted)] text-[16px] font-medium leading-relaxed max-w-md">
          You cannot send or receive direct messages while operating as a Ghost. Your inbox is safely locked.
          <br/><br/>
          Toggle Ghost Mode off in the sidebar to access your messages.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-48px)] max-w-3xl mx-auto m-6 bg-[var(--cx-bg-surface)] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-black/[0.04]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--cx-primary)]/10 rounded-xl flex items-center justify-center text-[var(--cx-primary)]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--cx-text-main)] tracking-tight">Messages</h1>
          </div>
          <button className="w-10 h-10 rounded-xl bg-[var(--cx-bg-base)] flex items-center justify-center text-[var(--cx-text-main)] hover:bg-black/[0.06] transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..." 
            className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-[14px] focus:bg-[var(--cx-bg-surface)] focus:border-[var(--cx-primary)]/30 outline-none transition-all text-[var(--cx-text-main)] font-semibold placeholder:text-[var(--cx-text-muted)]/60"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-12 text-center text-[var(--cx-text-muted)] font-medium">
            No conversations found.
          </div>
        ) : (
          filteredConversations.map(conv => (
            <Link 
              key={conv.id}
              to={`/chat/${conv.id}`}
              className="flex items-center gap-4 p-4 border-b border-black/[0.03] hover:bg-[var(--cx-bg-base)] transition-colors group"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-black/[0.06] flex items-center justify-center text-xl font-black text-[var(--cx-text-muted)] shrink-0">
                  {conv.otherUserName.charAt(0)}
                </div>
                {/* Mock Online Status */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[var(--cx-bg-surface)] rounded-full group-hover:border-[var(--cx-bg-base)] transition-colors"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`text-[15px] truncate ${conv.unread > 0 ? 'font-black text-[var(--cx-text-main)]' : 'font-bold text-[var(--cx-text-main)]'}`}>
                    {conv.otherUserName}
                  </h3>
                  <span className={`text-[11px] font-semibold shrink-0 ${conv.unread > 0 ? 'text-[var(--cx-primary)]' : 'text-[var(--cx-text-muted)]'}`}>
                    {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-[14px] truncate ${conv.unread > 0 ? 'font-bold text-[var(--cx-text-main)]' : 'font-medium text-[var(--cx-text-muted)]'}`}>
                  {conv.lastMessage}
                </p>
              </div>

              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[var(--cx-primary)] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  {conv.unread}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;



