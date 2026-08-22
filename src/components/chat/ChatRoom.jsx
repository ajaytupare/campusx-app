import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Smile, Paperclip, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const ChatRoom = ({ chat, otherUser }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!chat?.id) return;
    
    setLoading(true);
    const q = query(
      collection(db, 'chats', chat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetched);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [chat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !chat?.id) return;

    const text = newMessage.trim();
    setNewMessage(''); // optimistic clear

    try {
      // Add message to subcollection
      await addDoc(collection(db, 'chats', chat.id, 'messages'), {
        text: text,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      });

      // Update main chat doc with lastMessage
      await updateDoc(doc(db, 'chats', chat.id), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        // We can add unread counts here later
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F5F8FA]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Your Messages</h3>
          <p className="text-gray-500 text-sm">Select a conversation or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F5F8FA] h-full relative">
      
      {/* Chat Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-gray-500 font-bold text-lg">
            {otherUser?.avatar ? (
              <img src={otherUser.avatar} alt={otherUser?.name} className="w-full h-full object-cover" />
            ) : (
              otherUser?.name?.charAt(0)?.toUpperCase() || '?'
            )}
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 leading-tight">{otherUser?.name || 'Campus Student'}</h3>
            <p className="text-xs font-medium text-green-600">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hidden sm:block"><Phone className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hidden sm:block"><Video className="w-5 h-5" /></button>
          <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block"></div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <span className="bg-gray-200/60 text-gray-500 text-xs font-bold px-4 py-2 rounded-full tracking-wider">Start of conversation</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.uid;
            
            // Format time if createdAt exists (it might be null briefly due to serverTimestamp optimistic UI)
            const timeString = msg.createdAt?.toDate 
              ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : '';

            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0 mb-1">
                    {otherUser?.avatar ? (
                      <img src={otherUser.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-bold bg-gray-200">
                        {otherUser?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`${isMe ? 'bg-[#1D9BF0] text-white' : 'bg-white border border-gray-200 text-gray-800'} px-4 py-2.5 rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'} max-w-[75%] shadow-sm`}>
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                <span className="text-[10px] text-gray-400 font-medium mb-1.5 shrink-0">{timeString}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 sm:p-4 border-t border-gray-200 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2 sm:gap-3 bg-gray-100 rounded-2xl p-1.5 sm:p-2 sm:pr-3">
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 pb-1 pl-1">
            <button type="button" className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-200 rounded-full transition-colors"><Smile className="w-5 h-5" /></button>
            <button type="button" className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-200 rounded-full transition-colors"><Paperclip className="w-5 h-5" /></button>
          </div>
          <textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 min-h-[40px] text-sm py-2.5 text-gray-900 placeholder-gray-500 font-medium"
            rows="1"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-[#1D9BF0] text-white p-2.5 rounded-full hover:bg-blue-600 transition-colors shrink-0 mb-0.5 shadow-sm disabled:opacity-50 disabled:hover:bg-[#1D9BF0]"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatRoom;
