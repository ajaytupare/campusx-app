import { useState, useEffect } from 'react';
import { Loader2, Users, Shield } from 'lucide-react';
import { useGhost } from '../context/GhostContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ComposePost from '../components/feed/ComposePost';
import PostCard from '../components/feed/PostCard';

const Dashboard = () => {
  const { isGhostMode } = useGhost();
  const [activeFeedTab, setActiveFeedTab] = useState('Campus');
  
  // Feed State
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch Posts in Real-Time
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Post Composer - Dynamically reacts to Ghost Mode */}
      <div className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all duration-300 ${
        isGhostMode 
          ? 'bg-gray-900 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
          : 'bg-white border-gray-200'
      }`}>
        <ComposePost />
      </div>

      {/* Feed Filter Tabs */}
      <div className="flex gap-6 border-b border-gray-200 px-2 sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 pt-2">
        {['Campus', 'Following', 'Clubs'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveFeedTab(tab)}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeFeedTab === tab ? 'text-black' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
            {activeFeedTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-5">
        {loadingPosts ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : activeFeedTab === 'Following' ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Following System Coming Soon</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">We are building the Instagram-style request system next! Soon you'll see your friends' posts here.</p>
          </div>
        ) : activeFeedTab === 'Clubs' ? (
           <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clubs Directory Coming Soon</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">Discover and join campus clubs to see their latest events and updates here.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 text-sm">Be the first to share something on campus!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

    </div>
  );
};

export default Dashboard;
