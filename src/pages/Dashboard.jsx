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
  const { userProfile } = useAuth();

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
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        
        {/* Top Search Bar */}
        <div className="flex items-center justify-between bg-[var(--cx-bg-surface)] rounded-[20px] p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
          <div className="relative flex-1 max-w-md ml-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search campus discussions..." 
              className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[14px] py-2.5 pl-10 pr-4 text-[13px] focus:bg-[var(--cx-bg-surface)] focus:border-[var(--cx-primary)]/30 outline-none transition-all text-[var(--cx-text-main)] font-medium placeholder:text-[var(--cx-text-muted)]/60"
            />
          </div>
          
          <div className="flex items-center gap-2 pr-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--cx-bg-base)] transition-colors relative text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--cx-bg-surface)]"></span>
            </button>
          </div>
        </div>

        {/* Create Post */}
        <CreatePost />

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
      <div className="hidden lg:flex flex-col w-[300px] shrink-0 gap-6 pb-8">
        
        <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
          <h3 className="font-semibold text-[15px] text-[var(--cx-text-main)] mb-4 uppercase tracking-wide">
            My Campus Info
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold text-[var(--cx-text-muted)] uppercase">College</span>
              <p className="text-[14px] font-bold text-[var(--cx-text-main)]">{userProfile?.college || 'Not set'}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[var(--cx-text-muted)] uppercase">Department</span>
              <p className="text-[14px] font-bold text-[var(--cx-text-main)]">{userProfile?.department || 'Not set'}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[var(--cx-text-muted)] uppercase">Year</span>
              <p className="text-[14px] font-bold text-[var(--cx-text-main)]">Year {userProfile?.year || '1'}</p>
            </div>
          </div>
        </div>

        {/* Trending Events Widget */}
        <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
          <h3 className="font-semibold text-[15px] text-[var(--cx-text-main)] mb-4 uppercase tracking-wide">
            Trending Events
          </h3>
          <div className="space-y-4">
            {[
              { day: '14', mon: 'OCT', title: 'Tech Career Fair', time: '10:00 AM', color: 'bg-blue-50 text-blue-600' },
              { day: '15', mon: 'OCT', title: 'Biology Study Group', time: '6:30 PM', color: 'bg-green-50 text-green-600' },
              { day: '18', mon: 'OCT', title: 'Fall Festival', time: '12:00 PM', color: 'bg-orange-50 text-orange-600' }
            ].map((ev, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer">
                <div className={`w-11 h-11 rounded-[14px] flex flex-col items-center justify-center shrink-0 ${ev.color}`}>
                  <span className="text-[9px] font-semibold uppercase leading-none">{ev.mon}</span>
                  <span className="text-[15px] font-bold leading-none mt-0.5">{ev.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[13px] text-[var(--cx-text-main)] group-hover:text-[var(--cx-primary)] transition-colors leading-tight mb-0.5 truncate">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-[var(--cx-text-muted)]">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;


