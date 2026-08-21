import { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import CreatePost from '../components/forms/CreatePost';
import PostCard from '../components/cards/PostCard';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full max-w-6xl mx-auto">
      
      {/* Main Feed Column */}
      <div className="flex-1 min-w-0 flex flex-col gap-5 max-w-[600px]">
        
        {/* Top Search Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search CampusX..." 
              className="w-full bg-[var(--cx-bg-base)] border border-black/[0.06] rounded-full py-2.5 pl-11 pr-4 text-[13px] focus:bg-white focus:border-[var(--cx-text-muted)]/30 outline-none transition-all text-[var(--cx-text-main)] font-medium placeholder:text-[var(--cx-text-muted)]"
            />
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/[0.04] transition-colors relative text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)]">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-9 h-9 rounded-full bg-[var(--cx-bg-base)] overflow-hidden border border-black/[0.06]">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stories Section */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04] flex items-center gap-4 overflow-x-auto hide-scrollbar">
          
          {/* Add Story */}
          <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
            <div className="w-[58px] h-[58px] rounded-full border border-black/10 bg-[var(--cx-bg-base)] flex items-center justify-center text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-colors">
              <span className="text-[24px] font-normal leading-none mb-1">+</span>
            </div>
            <span className="text-[11px] font-bold text-[var(--cx-text-main)]">Add Story</span>
          </div>

          {/* Story Items */}
          {[
            { img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', name: 'Alex M.' },
            { img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', name: 'Sarah K.' },
            { isGhost: true, name: 'Ghost #412' },
            { img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80', name: 'Jay T.' },
          ].map((story, i) => (
            <div key={i} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group">
              <div className="w-[58px] h-[58px] rounded-full p-[2px] border-[2px] border-[#3D3D3D] transition-transform group-hover:scale-105">
                <div className={`w-full h-full rounded-full border-[2px] border-white overflow-hidden flex items-center justify-center bg-[var(--cx-bg-base)]`}>
                  {story.isGhost ? (
                    <span className="text-xl">👻</span>
                  ) : (
                    <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
              <span className="text-[11px] font-bold text-[var(--cx-text-main)]">{story.name}</span>
            </div>
          ))}
        </div>

        {/* Create Post */}
        <CreatePost />

        {/* Recent Activity Label */}
        <p className="text-center text-[13px] font-medium text-[var(--cx-text-muted)]">Recent Activity</p>

        {/* Feed Posts */}
        <div className="space-y-4 pb-8">
          {loading ? (
            <div className="text-center py-10 text-[var(--cx-text-muted)] font-medium text-[14px]">
              Loading campus pulse...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-[var(--cx-text-muted)] font-medium text-[14px] bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
              No posts yet. Be the first to start a conversation!
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>

      {/* Right Widget Column (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-[280px] shrink-0 gap-5 pb-8">
        
        {/* Trending on Campus */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
          <h3 className="font-bold text-[15px] text-[var(--cx-text-main)] mb-4 flex items-center gap-2">
            <span className="text-[18px]">📈</span> Trending on Campus
          </h3>
          <div className="space-y-4">
            {[
              { num: 1, cat: 'Sports', title: 'Homecoming Game Tickets', posts: '1.2k posts' },
              { num: 2, cat: 'Academics', title: 'Registration Site Crash', posts: '854 posts' },
              { num: 3, cat: 'Campus Life', title: 'Dining Hall Menu Change', posts: '532 posts' },
              { num: 4, cat: 'Local', title: 'New Coffee Shop Opening', posts: '210 posts' },
            ].map((item) => (
              <div key={item.num} className="cursor-pointer group">
                <p className="text-[11px] font-semibold text-[var(--cx-text-muted)]">{item.num} &bull; {item.cat}</p>
                <h4 className="text-[14px] font-bold text-[var(--cx-text-main)] group-hover:underline leading-tight">{item.title}</h4>
                <p className="text-[11px] font-medium text-[var(--cx-text-muted)]">{item.posts}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[13px] font-semibold text-[var(--cx-text-main)] hover:underline">Show more</button>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px] text-[var(--cx-text-main)]">Upcoming Events</h3>
            <button className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center text-[var(--cx-text-muted)] hover:bg-black/[0.04]">
              <span className="text-[14px]">+</span>
            </button>
          </div>
          <div className="space-y-3">
            {[
              { day: '14', mon: 'OCT', title: 'Tech Career Fair...', loc: 'Student Union', time: '10:00 AM' },
              { day: '16', mon: 'OCT', title: 'Acoustic Night & ...', loc: 'The Quad', time: '7:00 PM' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-12 h-14 rounded-xl border border-black/[0.06] flex flex-col items-center justify-center shrink-0 bg-white">
                  <span className="text-[10px] font-bold text-[var(--cx-text-muted)] uppercase leading-none">{ev.mon}</span>
                  <span className="text-[18px] font-bold text-[var(--cx-text-main)] leading-none mt-0.5">{ev.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-[var(--cx-text-main)] truncate group-hover:underline">{ev.title}</h4>
                  <p className="text-[11px] font-medium text-[var(--cx-text-muted)]">{ev.loc} &bull; {ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Communities For You */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
          <h3 className="font-bold text-[15px] text-[var(--cx-text-main)] mb-4">Communities For You</h3>
          <div className="space-y-3">
            {[
              { icon: '💻', name: 'CompSci Majors', members: '1.2k Members' },
              { icon: '🎨', name: 'Design Club', members: '460 Members' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--cx-bg-base)] flex items-center justify-center text-[16px]">{c.icon}</div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[var(--cx-text-main)]">{c.name}</h4>
                    <p className="text-[11px] font-medium text-[var(--cx-text-muted)]">{c.members}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 rounded-lg border border-black/10 text-[12px] font-bold text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-all">Join</button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--cx-text-muted)] font-medium px-2">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Guidelines</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



