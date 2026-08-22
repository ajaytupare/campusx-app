import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import ChatRoom from '../../components/chat/ChatRoom';

const Chat = () => {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState('Primary'); // 'Primary' or 'Requests'

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse active chat object based on ID
  const activeChatObj = chats.find(c => c.id === activeChatId) || (activeChatId ? { id: activeChatId } : null);
  
  // Determine who the "other user" is in the active chat
  const otherUserId = activeChatObj?.participants?.find(uid => uid !== currentUser?.uid);
  const otherUserDetails = activeChatObj?.participantDetails?.[otherUserId] || null;

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(fetchedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSelectChat = (chatId) => {
    setSearchParams({ id: chatId });
  };

  // Filter chats based on tab
  const primaryChats = chats.filter(c => 
    c.status !== 'pending' || c.requesterId === currentUser?.uid
  );
  
  const requestChats = chats.filter(c => 
    c.status === 'pending' && c.requesterId !== currentUser?.uid
  );

  const displayChats = activeTab === 'Primary' ? primaryChats : requestChats;

  return (
    <div className="flex h-full bg-white overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -mb-8 sm:-mb-8 lg:-mb-12 border-t border-gray-200">
      
      {/* Left Pane: Inbox List */}
      <div className={`w-full md:w-80 lg:w-96 flex-col border-r border-gray-200 bg-white z-20 h-full ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">Messages</h2>
        </div>

        {/* Tabs */}
        <div className="flex px-2 border-b border-gray-200 bg-white shrink-0">
          {['Primary', 'Requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3.5 text-sm font-bold transition-all relative ${
                activeTab === tab 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'Requests' && requestChats.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {requestChats.length}
                </span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : displayChats.length === 0 ? (
            <div className="text-center px-4 py-8">
              <p className="text-sm text-gray-500 font-medium">
                {activeTab === 'Primary' ? 'No messages yet.' : 'No message requests.'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {activeTab === 'Primary' 
                  ? 'When you message someone, it will appear here.' 
                  : 'Messages from people you don\'t know will appear here.'}
              </p>
            </div>
          ) : (
            displayChats.map((chat) => {
              const partnerId = chat.participants?.find(uid => uid !== currentUser.uid);
              const partnerInfo = chat.participantDetails?.[partnerId] || { name: 'Unknown' };
              
              const timeString = chat.lastMessageAt?.toDate 
                ? chat.lastMessageAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                : '';

              return (
                <div 
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors border-l-2 ${
                    activeChatId === chat.id 
                      ? 'bg-blue-50/50 border-blue-500' 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center text-lg font-bold text-gray-500">
                    {partnerInfo.avatar ? (
                      <img src={partnerInfo.avatar} alt={partnerInfo.name} className="w-full h-full object-cover" />
                    ) : (
                      partnerInfo.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-sm text-gray-900 truncate pr-2">{partnerInfo.name}</h4>
                      <span className={`text-[11px] font-medium shrink-0 ${activeChatId === chat.id ? 'text-blue-600' : 'text-gray-400'}`}>
                        {timeString}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs truncate text-gray-500 font-medium">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Conversation */}
      <div className={`flex-1 md:flex flex-col bg-[#F5F8FA] h-full relative ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <ChatRoom chat={activeChatObj} otherUser={otherUserDetails} />
      </div>

    </div>
  );
};

export default Chat;
