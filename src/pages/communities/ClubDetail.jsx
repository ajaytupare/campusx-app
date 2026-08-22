import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, Users, Ghost, Image as ImageIcon } from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, collection, query, orderBy, onSnapshot, addDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { isGhostMode } = useGhost();

  const [club, setClub] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [loadingClub, setLoadingClub] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch Club details
  useEffect(() => {
    const clubRef = doc(db, 'clubs', id);
    const unsubClub = onSnapshot(clubRef, (docSnap) => {
      if (docSnap.exists()) {
        setClub({ id: docSnap.id, ...docSnap.data() });
      } else {
        setClub(null);
      }
      setLoadingClub(false);
    });
    return () => unsubClub();
  }, [id]);

  const isMember = currentUser && club?.memberIds?.includes(currentUser.uid);

  // Fetch Messages (only if member)
  useEffect(() => {
    if (!isMember) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }

    const q = query(collection(db, 'clubs', id, 'messages'), orderBy('createdAt', 'asc'));
    const unsubMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
      setLoadingMessages(false);
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => unsubMessages();
  }, [id, isMember]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJoinLeave = async () => {
    if (!currentUser || !club) return;
    setIsJoining(true);
    try {
      const clubRef = doc(db, 'clubs', club.id);
      if (isMember) {
        await updateDoc(clubRef, { memberIds: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(clubRef, { memberIds: arrayUnion(currentUser.uid) });
      }
    } catch (error) {
      console.error("Error updating membership:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !isMember) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // optimistic clear

    try {
      await addDoc(collection(db, 'clubs', club.id, 'messages'), {
        text: messageText,
        authorId: currentUser.uid,
        authorName: isGhostMode ? 'Ghost' : (userData?.displayName || currentUser.displayName || 'Student'),
        authorAvatar: isGhostMode ? null : (userData?.photoURL || currentUser.photoURL || null),
        isGhost: isGhostMode,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  if (loadingClub) {
    return <div className="w-full h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (!club) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Club not found</h2>
        <p className="text-gray-500 mb-6">This club may have been deleted.</p>
        <button onClick={() => navigate('/clubs')} className="px-6 py-2 bg-black text-white rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  const memberCount = club.memberIds?.length || 0;

  return (
    <div className="w-full flex flex-col min-h-screen pb-12 animate-in fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 shrink-0">
        <div className="h-32 md:h-48 bg-gray-100 relative">
          {club.image ? (
            <img src={club.image} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100"></div>
          )}
          
          <button 
            onClick={() => navigate('/clubs')} 
            className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          
          <div className="absolute -bottom-8 left-6">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border-4 border-white overflow-hidden flex items-center justify-center font-bold text-3xl text-gray-400">
              {club.logo ? (
                <img src={club.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                club.name?.charAt(0)
              )}
            </div>
          </div>
        </div>

        <div className="pt-10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">{club.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
              <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">{club.category}</span>
              <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {memberCount} Member{memberCount !== 1 ? 's' : ''}</div>
            </div>
          </div>
          
          <button 
            onClick={handleJoinLeave}
            disabled={isJoining}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              isMember 
              ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isJoining ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isMember ? 'Leave Club' : 'Join Club')}
          </button>
        </div>
        <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {club.description}
        </div>
      </div>

      {/* Discussion Area */}
      {!isMember ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Members Only</h2>
          <p className="text-gray-500 max-w-sm mb-6">You must join {club.name} to view and participate in the group discussion.</p>
          <button 
            onClick={handleJoinLeave}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Join the Club
          </button>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-h-[500px]">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Group Discussion</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 flex flex-col gap-4">
            {loadingMessages ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-medium">No messages yet. Say hi to the club!</p>
              </div>
            ) : (
              messages.map(msg => {
                const isMe = msg.authorId === currentUser?.uid;
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs ${
                      msg.isGhost ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {msg.isGhost ? (
                        <Ghost className="w-4 h-4" />
                      ) : msg.authorAvatar ? (
                        <img src={msg.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        msg.authorName?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-700">{msg.authorName}</span>
                        {msg.createdAt && (
                          <span className="text-[10px] text-gray-400">
                            {msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                        isMe 
                        ? (msg.isGhost ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-black text-white rounded-tr-sm') 
                        : (msg.isGhost ? 'bg-white border border-purple-100 text-gray-800 rounded-tl-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm')
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className={`flex items-end gap-2 p-2 rounded-xl border ${isGhostMode ? 'bg-purple-50/50 border-purple-200' : 'bg-gray-50 border-gray-200 focus-within:border-black focus-within:bg-white'} transition-colors`}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isGhostMode ? "Message anonymously as Ghost..." : "Send a message to the club..."}
                className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none text-sm p-2 outline-none"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`p-2.5 rounded-lg text-white font-medium shrink-0 shadow-sm transition-colors disabled:opacity-50 ${isGhostMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-black hover:bg-gray-800'}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetail;
