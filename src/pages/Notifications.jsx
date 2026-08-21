import { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Ghost, Check, MoreHorizontal } from 'lucide-react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');

  // Move notifications into state so they can be interacted with
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      content: 'liked your post about the CS 401 midterm.',
      time: '10m',
      isUnread: true,
    },
    {
      id: 2,
      type: 'ghost',
      user: 'Ghost',
      avatar: null,
      content: 'Someone posted anonymously near your location: "Does anyone have the notes for..."',
      time: '1h',
      isUnread: true,
    },
    {
      id: 3,
      type: 'reply',
      user: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      content: 'replied: "Yeah, the answer to question 4 is actually C."',
      time: '2h',
      isUnread: false,
    },
    {
      id: 4,
      type: 'follow',
      user: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      content: 'started following you.',
      time: '5h',
      isUnread: false,
    },
    {
      id: 5,
      type: 'like',
      user: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      content: 'liked your comment.',
      time: '1d',
      isUnread: false,
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'reply': return <MessageCircle className="w-5 h-5 text-[#1D9BF0] fill-[#1D9BF0]" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'ghost': return <Ghost className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  // Action: Mark single notification as read
  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isUnread: false } : notif
    ));
    // Note: When the backend is hooked up, this would also navigate the user to the specific post.
  };

  // Action: Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isUnread: false })));
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-6 mb-6 pt-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Check className="w-4 h-4" /> Mark all read
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-2 pt-2">
          <button 
            onClick={() => setActiveTab('All')}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors border-b-2 rounded-t-xl ${
              activeTab === 'All' ? 'border-black text-gray-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('Mentions')}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors border-b-2 rounded-t-xl ${
              activeTab === 'Mentions' ? 'border-black text-gray-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Mentions
          </button>
        </div>

        {/* Notification List */}
        <div className="flex flex-col">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => handleNotificationClick(notif.id)}
              className={`flex items-start gap-4 p-5 border-b border-gray-100 transition-all duration-300 cursor-pointer relative group ${
                notif.isUnread ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'bg-white hover:bg-gray-50'
              }`}
            >
              
              {/* Unread Indicator */}
              {notif.isUnread && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full transition-all"></div>
              )}

              {/* Icon Column */}
              <div className="pt-1 shrink-0 w-8 flex justify-end">
                {getIcon(notif.type)}
              </div>

              {/* Content Column */}
              <div className="flex-1 min-w-0">
                
                {/* Avatar (if applicable) */}
                {notif.type !== 'ghost' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mb-2">
                    <img src={notif.avatar} alt={notif.user} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Text */}
                <div className="text-[15px] leading-relaxed text-gray-800 pr-8">
                  <span className="font-bold text-gray-900 mr-1">{notif.user}</span>
                  {notif.content}
                </div>

              </div>

              {/* Right Meta Column */}
              <div className="flex flex-col items-end shrink-0 gap-2">
                <span className="text-[12px] font-medium text-gray-400">{notif.time}</span>
                <button className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}

          {/* Load More */}
          <button className="w-full py-4 text-sm font-bold text-blue-500 hover:bg-gray-50 transition-colors">
            Show older notifications
          </button>
        </div>

      </div>

    </div>
  );
};

export default Notifications;
