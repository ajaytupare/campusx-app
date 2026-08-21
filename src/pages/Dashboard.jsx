import { Search, Bell, Image as ImageIcon, Smile, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

const RightWidgets = () => (
  <div className="flex flex-col gap-5 pl-4">
    {/* Search Bar (Moved to right sidebar for cleaner layout, like Twitter) */}
    <div className="relative mb-2">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
      <input 
        type="text" 
        placeholder="Search CampusX..." 
        className="w-full bg-white border border-[var(--border-light)] rounded-full py-2.5 pl-11 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all text-[var(--text-main)] placeholder-[var(--text-muted)] shadow-sm"
      />
    </div>

    {/* Trending Box */}
    <div className="bg-white rounded-2xl p-5 border border-[var(--border-light)] shadow-sm">
      <h3 className="font-bold text-[16px] text-[var(--text-main)] mb-4">Trending on Campus</h3>
      <div className="space-y-4">
        {[
          { category: 'Sports', title: 'Homecoming Tickets Sold Out', posts: '1.2k posts' },
          { category: 'Academics', title: 'Registration Site Crashed', posts: '854 posts' },
          { category: 'Campus Life', title: 'New Dining Hall Menu', posts: '532 posts' },
        ].map((item, i) => (
          <div key={i} className="cursor-pointer group">
            <p className="text-[12px] font-medium text-[var(--text-muted)] mb-0.5">{item.category}</p>
            <h4 className="text-[14px] font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] leading-tight">{item.title}</h4>
            <p className="text-[12px] font-medium text-[var(--text-muted)] mt-0.5">{item.posts}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Upcoming Events Box */}
    <div className="bg-white rounded-2xl p-5 border border-[var(--border-light)] shadow-sm">
      <h3 className="font-bold text-[16px] text-[var(--text-main)] mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {[
          { mon: 'OCT', day: '14', title: 'Tech Career Fair', time: '10:00 AM' },
          { mon: 'OCT', day: '16', title: 'Acoustic Night', time: '7:00 PM' },
        ].map((ev, i) => (
          <div key={i} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-base)] flex flex-col items-center justify-center shrink-0 border border-[var(--border-light)]">
              <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase leading-none">{ev.mon}</span>
              <span className="text-[16px] font-bold text-[var(--text-main)] leading-none mt-1">{ev.day}</span>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] leading-tight">{ev.title}</h4>
              <p className="text-[12px] font-medium text-[var(--text-muted)] mt-0.5">{ev.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [rightSidebarEl, setRightSidebarEl] = useState(null);

  useEffect(() => {
    setRightSidebarEl(document.getElementById('right-sidebar-slot'));
  }, []);

  return (
    <>
      {/* Portal the widgets into the layout's right column */}
      {rightSidebarEl && createPortal(<RightWidgets />, rightSidebarEl)}

      {/* Top Mobile Header (Hidden on Desktop) */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold tracking-tight text-[var(--text-main)]">CampusX</h1>
        <button className="w-10 h-10 rounded-full bg-white border border-[var(--border-light)] flex items-center justify-center relative text-[var(--text-muted)]">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Post Composer */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[var(--border-light)] shadow-sm mb-6">
        <div className="flex gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 shrink-0 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Me" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <textarea 
              placeholder="What's happening on campus?"
              className="w-full bg-transparent border-none text-[15px] sm:text-[16px] outline-none resize-none min-h-[50px] sm:min-h-[60px] font-medium text-[var(--text-main)] placeholder-[var(--text-muted)] pt-1 sm:pt-2"
            />
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
              <div className="flex gap-1 sm:gap-2">
                <button className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-full transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className="bg-[var(--accent-primary)] text-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-[13px] sm:text-[14px] hover:bg-[var(--accent-hover)] transition-all">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Separator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-[var(--border-light)] flex-1"></div>
        <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Recent Activity</span>
        <div className="h-px bg-[var(--border-light)] flex-1"></div>
      </div>

      {/* Mock Feed Posts */}
      <div className="flex flex-col gap-5">
        
        {/* Post 1 */}
        <article className="bg-white rounded-2xl p-4 sm:p-5 border border-[var(--border-light)] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[14px] sm:text-[15px] text-[var(--text-main)] leading-tight">Sarah Jenkins</h4>
                <p className="text-[12px] sm:text-[13px] font-medium text-[var(--text-muted)]">Biology '25 &bull; 2h ago</p>
              </div>
            </div>
          </div>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[var(--text-main)] mb-4">
            Just finished my final presentation for Bio 401. So relieved! Anyone want to grab coffee at the union to celebrate? ☕️
          </p>
          <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-[var(--border-light)]">
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[var(--text-muted)] hover:text-red-500 transition-colors">
              <Heart className="w-[18px] h-[18px]" /> 24
            </button>
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
              <MessageCircle className="w-[18px] h-[18px]" /> 5
            </button>
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <Share2 className="w-[18px] h-[18px]" />
            </button>
            <button className="ml-auto text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <Bookmark className="w-[18px] h-[18px]" />
            </button>
          </div>
        </article>

        {/* Post 2 */}
        <article className="bg-white rounded-2xl p-4 sm:p-5 border border-[var(--border-light)] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--text-main)] flex items-center justify-center shrink-0">
                <span className="text-xl">👻</span>
              </div>
              <div>
                <h4 className="font-bold text-[14px] sm:text-[15px] text-[var(--text-main)] leading-tight flex items-center gap-2">
                  Ghost #892 
                  <span className="bg-[var(--bg-base)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">Verified</span>
                </h4>
                <p className="text-[12px] sm:text-[13px] font-medium text-[var(--text-muted)]">Verified Student &bull; 4h ago</p>
              </div>
            </div>
          </div>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[var(--text-main)] mb-4">
            To the person playing saxophone in the South Quad at 2 AM last night: You are incredibly talented, but please, I have an 8 AM lecture. 🎷💀
          </p>
          <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-[var(--border-light)]">
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[var(--text-muted)] hover:text-red-500 transition-colors">
              <Heart className="w-[18px] h-[18px]" /> 215
            </button>
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
              <MessageCircle className="w-[18px] h-[18px]" /> 45
            </button>
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <Share2 className="w-[18px] h-[18px]" />
            </button>
            <button className="ml-auto text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <Bookmark className="w-[18px] h-[18px]" />
            </button>
          </div>
        </article>

      </div>
    </>
  );
};

export default Dashboard;
