import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { ArrowLeft, Send, Ghost, Image as ImageIcon } from 'lucide-react';

const MOCK_MESSAGES = {
  'conv_1': [
    { id: 'm1', senderId: 'u1', text: 'Hey, are we still meeting for the study group?', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 'm2', senderId: 'u1', text: 'I brought the practice exams.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
  ],
  'conv_2': [
    { id: 'm3', senderId: 'me', text: 'Hey Emily, could you send me the notes from yesterday?', timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString() },
    { id: 'm4', senderId: 'u3', text: 'Thanks for the notes!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() } // Reversed for flow mock
  ],
  'conv_3': [
    { id: 'm5', senderId: 'u6', text: 'Yeah, the midterm was brutal.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
  ]
};

const ChatConversation = () => {
  const { conversationId } = useParams();
  const { currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState({ name: 'Student' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Find conversation metadata
    const allConvs = JSON.parse(localStorage.getItem('cx_mock_conversations') || '[]');
    const conv = allConvs.find(c => c.id === conversationId);
    if (conv) {
      setOtherUser({ name: conv.otherUserName, id: conv.otherUserId });
      
      // Clear unread on load
      if (conv.unread > 0) {
        conv.unread = 0;
        localStorage.setItem('cx_mock_conversations', JSON.stringify(allConvs));
      }
    }

    // Load messages
    const allMessages = JSON.parse(localStorage.getItem('cx_mock_messages') || '{}');
    if (!allMessages[conversationId] && MOCK_MESSAGES[conversationId]) {
      allMessages[conversationId] = MOCK_MESSAGES[conversationId];
      localStorage.setItem('cx_mock_messages', JSON.stringify(allMessages));
    }
    setMessages(allMessages[conversationId] || []);
  }, [conversationId]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const allMessages = JSON.parse(localStorage.getItem('cx_mock_messages') || '{}');
    const convMessages = allMessages[conversationId] || [];

    const msgObj = {
      id: 'm_' + Date.now(),
      senderId: currentUser?.uid || 'me',
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    convMessages.push(msgObj);
    allMessages[conversationId] = convMessages;
    localStorage.setItem('cx_mock_messages', JSON.stringify(allMessages));

    // Update conversation lastMessage
    const allConvs = JSON.parse(localStorage.getItem('cx_mock_conversations') || '[]');
    const convIndex = allConvs.findIndex(c => c.id === conversationId);
    if (convIndex > -1) {
      allConvs[convIndex].lastMessage = newMessage.trim();
      allConvs[convIndex].timestamp = msgObj.timestamp;
      // Move to top
      const [updatedConv] = allConvs.splice(convIndex, 1);
      allConvs.unshift(updatedConv);
      localStorage.setItem('cx_mock_conversations', JSON.stringify(allConvs));
    }

    setMessages([...convMessages]);
    setNewMessage('');
  };

  // GHOST RESTRICTION UI
  if (isGhostMode) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-100px)] max-w-2xl mx-auto text-center px-4">
        <div className="w-24 h-24 bg-[var(--cx-ghost-start)]/10 rounded-[32px] flex items-center justify-center mb-6">
          <Ghost className="w-12 h-12 text-[var(--cx-ghost-start)]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--cx-text-main)] tracking-tight mb-4">
          Chat is Disabled
        </h1>
        <p className="text-[var(--cx-text-muted)] text-[16px] font-medium leading-relaxed max-w-md mb-8">
          You cannot read or reply to direct messages while operating as a Ghost. Your conversations are securely locked.
        </p>
        <Link to="/chat" className="px-6 py-3 bg-[var(--cx-bg-surface)] text-[var(--cx-text-main)] rounded-xl font-bold border border-zinc-200 hover:bg-[var(--cx-bg-base)] transition-colors">
          Return to Inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-48px)] max-w-4xl mx-auto m-6 bg-[var(--cx-bg-surface)] rounded-[24px] shadow-sm border border-zinc-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 flex items-center gap-4 bg-[var(--cx-bg-surface)] z-10 shadow-sm">
        <Link to="/chat" className="p-2 rounded-xl text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-lg font-black text-zinc-500 shrink-0">
            {otherUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-[var(--cx-text-main)] leading-tight">{otherUser.name}</h2>
            <span className="text-[12px] font-bold text-green-500">Online</span>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-6 bg-[var(--cx-bg-base)] flex flex-col gap-4">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === (currentUser?.uid || 'me');
          const showAvatar = !isMe && (idx === 0 || messages[idx-1].senderId !== msg.senderId);

          return (
            <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className="w-8 h-8 shrink-0 mr-2 flex items-end">
                  {showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-[10px] font-black text-zinc-600">
                      {otherUser.name.charAt(0)}
                    </div>
                  )}
                </div>
              )}
              
              <div className={`max-w-[70%] rounded-[20px] px-4 py-2.5 text-[15px] font-medium leading-relaxed
                ${isMe 
                  ? 'bg-[var(--cx-primary)] text-white rounded-br-sm shadow-sm shadow-indigo-500/20' 
                  : 'bg-white border border-zinc-200 text-[var(--cx-text-main)] rounded-bl-sm shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--cx-bg-surface)] border-t border-zinc-200">
        <form onSubmit={handleSend} className="flex items-end gap-2 relative">
          <button type="button" className="p-3 text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)] rounded-xl transition-colors shrink-0 mb-0.5">
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Message..."
            className="flex-1 bg-[var(--cx-bg-base)] border border-transparent rounded-[20px] px-4 py-3 text-[15px] outline-none resize-none min-h-[48px] max-h-[120px] font-medium transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] placeholder:text-[var(--cx-text-muted)]/50"
            rows={1}
          />
          
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-3 rounded-xl flex items-center justify-center transition-all shrink-0 mb-0.5
              ${!newMessage.trim() ? 'bg-[var(--cx-bg-base)] text-[var(--cx-text-muted)] cursor-not-allowed' : 'bg-[var(--cx-primary)] text-white shadow-md shadow-indigo-500/30 hover:scale-105 active:scale-95'}`}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatConversation;
