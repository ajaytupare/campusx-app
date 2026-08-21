import { useState } from 'react';
import { Image as ImageIcon, Smile, MessageCircle, Heart, Share2, Ghost, MapPin, Calendar, BarChart2, MoreHorizontal } from 'lucide-react';
import { useGhost } from '../context/GhostContext';

const Dashboard = () => {
  const { isGhostMode } = useGhost();
  const [activeFeedTab, setActiveFeedTab] = useState('Campus');

  // Dummy Events
  const upcomingEvents = [
    { id: 1, title: 'Spring Career Fair', time: 'Today, 2:00 PM', image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=300&q=80' },
    { id: 2, title: 'Campus Hackathon', time: 'Tomorrow, 9:00 AM', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=80' },
    { id: 3, title: 'Mainstage Concert', time: 'Friday, 8:00 PM', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&q=80' },
    { id: 4, title: 'Alumni Mixer', time: 'Saturday, 6:00 PM', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80' },
  ];

  // Dummy Posts with Mixed Types
  const posts = [
    {
      id: 1,
      type: 'text',
      user: 'Sarah Jenkins',
      major: "Biology '25",
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      time: '2h ago',
      content: "Just finished my final presentation for Bio 401. So relieved! Anyone want to grab coffee at the union to celebrate? ☕️",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      type: 'poll',
      user: 'Student Government',
      major: 'Official Org',
      avatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=150&q=80',
      time: '4h ago',
      content: "We are finalizing the food truck lineup for Spring Fest! Which of these is your top choice?",
      pollData: [
        { option: 'Taco Stand', votes: 45, percent: 52 },
        { option: 'Korean BBQ', votes: 28, percent: 32 },
        { option: 'Vegan Bowls', votes: 14, percent: 16 },
      ],
      totalVotes: 87,
      likes: 112,
      comments: 18,
    },
    {
      id: 3,
      type: 'ghost',
      user: 'Ghost',
      major: 'Anonymous nearby',
      avatar: null,
      time: '5h ago',
      content: "Does anyone else feel like the wifi in the science building has been completely unusable this week? I can't even load Canvas.",
      likes: 340,
      comments: 42,
    },
    {
      id: 4,
      type: 'image',
      user: 'Mike Ross',
      major: "Design '24",
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      time: '6h ago',
      content: "Sneak peek of the posters I designed for the upcoming indie film festival on campus! Really proud of how these turned out. 🎥✨",
      postImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
      likes: 89,
      comments: 12,
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Post Composer - Dynamically reacts to Ghost Mode */}
      <div className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all duration-300 ${
        isGhostMode 
          ? 'bg-gray-900 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center transition-colors ${
            isGhostMode ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
            {isGhostMode ? (
              <Ghost className="w-6 h-6" />
            ) : (
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" alt="Me" className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="flex-1">
            <textarea 
              placeholder={isGhostMode ? "Share an anonymous secret to campus..." : "What's happening on campus?"}
              className={`w-full bg-transparent border-none text-base outline-none resize-none min-h-[60px] font-medium pt-2 transition-colors ${
                isGhostMode ? 'text-white placeholder-purple-300' : 'text-gray-900 placeholder-gray-400'
              }`}
            />
            <div className={`flex items-center justify-between pt-3 border-t mt-2 transition-colors ${
              isGhostMode ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <div className="flex gap-2">
                <button className={`p-2 rounded-full transition-colors ${
                  isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-full transition-colors ${
                  isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className={`px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-sm ${
                isGhostMode ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-black text-white hover:bg-gray-800'
              }`}>
                {isGhostMode ? 'Post as Ghost' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Carousel */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <Calendar className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-gray-900">Happening on Campus</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="relative w-40 h-28 rounded-2xl overflow-hidden shrink-0 group cursor-pointer shadow-sm border border-gray-200">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-white text-xs font-bold leading-tight mb-1">{event.title}</h4>
                <p className="text-gray-300 text-[10px] font-medium">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center border-b border-gray-200 mt-2">
        {['Campus', 'Following', 'Trending'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveFeedTab(tab)}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              activeFeedTab === tab ? 'border-black text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-5">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
              post.type === 'ghost' ? 'border-purple-200' : 'border-gray-200'
            }`}
          >
            
            {/* Ghost Mode Header Ribbon */}
            {post.type === 'ghost' && (
              <div className="bg-purple-50 px-5 py-2 border-b border-purple-100 flex items-center gap-2">
                <Ghost className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-900 tracking-wide uppercase">Anonymous Post</span>
              </div>
            )}

            <div className="p-5">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center ${
                    post.type === 'ghost' ? 'bg-purple-100' : 'bg-gray-200'
                  }`}>
                    {post.type === 'ghost' ? (
                      <Ghost className="w-5 h-5 text-purple-500" />
                    ) : (
                      <img src={post.avatar} alt="User" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${post.type === 'ghost' ? 'text-purple-900' : 'text-gray-900'}`}>
                      {post.user}
                    </h4>
                    <p className="text-xs font-medium text-gray-500">{post.major} &bull; {post.time}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              {/* Post Content */}
              <p className="text-[15px] leading-relaxed text-gray-800 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Image Post Type */}
              {post.type === 'image' && (
                <div className="rounded-xl overflow-hidden border border-gray-100 mb-4 bg-gray-50 max-h-[400px]">
                  <img src={post.postImage} alt="Post Attachment" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Poll Post Type */}
              {post.type === 'poll' && (
                <div className="flex flex-col gap-3 mb-4">
                  {post.pollData.map((pollItem, idx) => (
                    <div key={idx} className="relative h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center px-4 cursor-pointer hover:bg-gray-100 transition-colors">
                      {/* Progress Bar Background */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-blue-100/50 z-0" 
                        style={{ width: `${pollItem.percent}%` }}
                      ></div>
                      {/* Text Overlap */}
                      <div className="relative z-10 w-full flex justify-between text-sm font-bold text-gray-800">
                        <span>{pollItem.option}</span>
                        <span>{pollItem.percent}%</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-1">
                    <BarChart2 className="w-3.5 h-3.5" /> {post.totalVotes} votes
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors group">
                  <Heart className="w-[18px] h-[18px] group-active:scale-125 transition-transform" /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-500 transition-colors group">
                  <MessageCircle className="w-[18px] h-[18px] group-active:scale-125 transition-transform" /> {post.comments}
                </button>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-500 transition-colors ml-auto group">
                  <Share2 className="w-[18px] h-[18px] group-active:scale-125 transition-transform" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
