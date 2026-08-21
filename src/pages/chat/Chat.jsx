import { useState } from 'react';
import { Search, Edit, MoreVertical, Phone, Video, Image as ImageIcon, Smile, Paperclip, Send } from 'lucide-react';

const Chat = () => {
  const [activeChat, setActiveChat] = useState(1);

  const chats = [
    { id: 1, name: 'Study Group - Bio 401', preview: 'Sarah: Anyone want to grab coffee?', time: '2m', unread: 3, isGroup: true },
    { id: 2, name: 'Alex Chen', preview: 'Did you finish the assignment?', time: '1h', unread: 0, isGroup: false },
    { id: 3, name: 'Campus Hackathon', preview: 'Registration closes tomorrow!', time: '4h', unread: 12, isGroup: true },
    { id: 4, name: 'Prof. Davis', preview: 'Your paper looks good. Just a few edits.', time: '1d', unread: 0, isGroup: false },
    { id: 5, name: 'Ghost #402', preview: 'Meet me at the quad at midnight.', time: '1d', unread: 0, isGroup: false },
  ];

  return (
    <div className="flex w-full h-full bg-white">
      
      {/* Left Pane: Chat List */}
      <div className="w-[350px] shrink-0 border-r border-gray-200 flex flex-col h-full bg-white">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-gray-100 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors border-l-2 ${
                activeChat === chat.id 
                  ? 'bg-blue-50/50 border-blue-500' 
                  : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                {chat.isGroup ? (
                  <span className="text-gray-500 font-bold">SG</span>
                ) : (
                  <img src={`https://i.pravatar.cc/150?u=${chat.id}`} alt={chat.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-bold text-sm text-gray-900 truncate pr-2">{chat.name}</h4>
                  <span className={`text-[11px] font-medium shrink-0 ${activeChat === chat.id || chat.unread > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500 font-medium'}`}>
                    {chat.preview}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 min-w-[20px] text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Active Conversation */}
      <div className="flex-1 flex flex-col bg-[#F5F8FA] h-full relative">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
              <span className="w-full h-full flex items-center justify-center text-gray-500 font-bold">SG</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 leading-tight">Study Group - Bio 401</h3>
              <p className="text-xs font-medium text-blue-600">4 members online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"><Phone className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"><Video className="w-5 h-5" /></button>
            <div className="w-px h-5 bg-gray-200 mx-1"></div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="bg-gray-200/60 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
          </div>

          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0 mb-1">
              <img src="https://i.pravatar.cc/150?u=9" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[70%] shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 mb-1">Alex Chen</p>
              <p className="text-sm text-gray-800">Did anyone figure out question 4 on the lab report?</p>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mb-1.5">10:42 AM</span>
          </div>

          <div className="flex items-end gap-2 flex-row-reverse">
            <div className="bg-[#1D9BF0] text-white px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[70%] shadow-sm">
              <p className="text-sm">Yeah, you have to use the formula from chapter 3. I'll send a picture of my notes.</p>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mb-1.5">10:45 AM</span>
          </div>

          <div className="flex items-end gap-2 flex-row-reverse">
            <div className="bg-[#1D9BF0] text-white p-1 rounded-2xl rounded-br-sm max-w-[70%] shadow-sm">
              <div className="w-48 h-64 bg-blue-400 rounded-xl overflow-hidden flex items-center justify-center">
                <span className="text-xs font-bold">Image Attached</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mb-1.5">10:45 AM</span>
          </div>

          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0 mb-1">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[70%] shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 mb-1">Sarah Jenkins</p>
              <p className="text-sm text-gray-800">Life saver! 🙏 Anyone want to grab coffee at the union to celebrate finishing this?</p>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mb-1.5">10:50 AM</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-200 shrink-0">
          <div className="flex items-end gap-3 bg-gray-100 rounded-2xl p-2 pr-3">
            <div className="flex items-center gap-1 shrink-0 pb-1 pl-1">
              <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-200 rounded-full transition-colors"><Smile className="w-5 h-5" /></button>
              <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-200 rounded-full transition-colors"><Paperclip className="w-5 h-5" /></button>
              <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-200 rounded-full transition-colors"><ImageIcon className="w-5 h-5" /></button>
            </div>
            <textarea 
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 min-h-[40px] text-sm py-2.5 text-gray-900 placeholder-gray-500 font-medium"
              rows="1"
            />
            <button className="bg-[#1D9BF0] text-white p-2.5 rounded-full hover:bg-blue-600 transition-colors shrink-0 mb-0.5 shadow-sm">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
