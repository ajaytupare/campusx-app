import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, UserPlus, MapPin, GraduationCap, Edit2, Clock, Calendar, Upload, Ghost } from 'lucide-react';
import PostCard from '../../components/cards/PostCard'; // Added import for PostCard
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc, limit } from 'firebase/firestore';

// Mock other users on the platform
const MOCK_OTHER_USERS = {
  'usr_2': {
    id: 'usr_2',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    major: 'Computer Science',
    year: 'Class of 2026',
    bio: 'Building cool things with React and Node.js. Always down for a hackathon.',
    location: 'North Campus',
    friendsCount: 142
  },
  'usr_3': {
    id: 'usr_3',
    name: 'Michael Chang',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
    cover: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    major: 'Business Administration',
    year: 'Class of 2025',
    bio: 'Finance enthusiast. VP of the Investment Banking Club.',
    location: 'West Campus',
    friendsCount: 389
  }
};

const UserProfile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  
  const isMe = userId === 'me' || userId === currentUser?.uid;
  
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]); // State for user's posts

  useEffect(() => {
    let currentProfile = null;
    if (isMe) {
      // Load current user's profile from local storage, or initialize defaults
      let storedProfile = JSON.parse(localStorage.getItem('cx_current_user_profile'));
      if (!storedProfile) {
        storedProfile = {
          id: currentUser?.uid || 'usr_1', // default fallback
          name: 'Alex Chen', // Mocked base name
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
          major: 'Undeclared',
          college: '',
          semester: '',
          year: 'Class of 2027',
          bio: 'Just joined CampusX!',
          location: 'Campus',
          friendsCount: 12
        };
        localStorage.setItem('cx_current_user_profile', JSON.stringify(storedProfile));
      }
      
      // Enforce the correct ID from AuthContext if it was saved incorrectly as 'me' initially
      if (currentUser?.uid && storedProfile.id === 'me') {
        storedProfile.id = currentUser.uid;
        localStorage.setItem('cx_current_user_profile', JSON.stringify(storedProfile));
      }

      setProfileData(storedProfile);
      currentProfile = storedProfile;
      
    } else {
      // Load another user's profile
      const user = MOCK_OTHER_USERS[userId];
      if (user) {
        setProfileData(user);
        currentProfile = user;
      } else {
        setProfileData(null); // User not found
      }
    }

    // Fetch posts for this user from Firestore
    const fetchUserPosts = async (profile) => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('authorId', '==', profile.id),
          where('isGhost', '==', false),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort descending by createdAt
        fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    if (currentProfile) {
      fetchUserPosts(currentProfile);
    }

  }, [userId, isMe, currentUser]);

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-[var(--cx-bg-surface)] rounded-[24px] shadow-sm border border-[var(--cx-text-muted)]/10">
        <h2 className="text-2xl font-bold text-[var(--cx-text-main)] mb-2">User Not Found</h2>
        <p className="text-[var(--cx-text-muted)] font-medium">This profile doesn't exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full max-w-[1050px] mx-auto gap-6 pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-b-[24px] overflow-hidden shadow-sm border border-black/5">
        
        {/* Cover Photo */}
        <div className="h-48 sm:h-72 lg:h-80 w-full relative bg-zinc-100">
          <img src={profileData.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Profile Header Info */}
        <div className="px-4 sm:px-8 relative">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 sm:-mt-20 mb-4 gap-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 z-10 w-full">
              {/* Avatar */}
              <div className="w-32 h-32 sm:w-[168px] sm:h-[168px] rounded-full border-4 border-white overflow-hidden bg-zinc-100 shadow-sm shrink-0">
                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Name & Basic Info */}
              <div className="flex-1 pb-2 sm:pb-6 w-full">
                <h1 className="text-[32px] font-black text-zinc-900 tracking-tight leading-none mb-2">{profileData.name || 'Anonymous Student'}</h1>
                <p className="text-[15px] font-bold text-zinc-500">
                  <span className="text-zinc-900">{profileData.friendsCount}</span> friends
                </p>
                
                {/* Mobile action buttons */}
                <div className="flex items-center gap-2 mt-4 sm:hidden w-full">
                  {isMe ? (
                    <Link to="/settings" className="flex-1 py-2.5 bg-zinc-100 rounded-[8px] font-bold text-[14px] text-zinc-900 text-center flex items-center justify-center gap-2">
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </Link>
                  ) : (
                    <>
                      <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-[8px] font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20">
                        <UserPlus className="w-4 h-4" /> Add Friend
                      </button>
                      <Link to="/chat" className="flex-1 py-2.5 bg-zinc-100 rounded-[8px] font-bold text-[14px] text-zinc-900 text-center flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Message
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-3 pb-6 shrink-0">
              {isMe ? (
                <Link 
                  to="/settings"
                  className="px-5 py-2.5 bg-zinc-100 rounded-[8px] font-bold text-[14px] text-zinc-900 hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Link>
              ) : (
                <>
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-[8px] font-bold text-[14px] hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
                    <UserPlus className="w-4 h-4" /> Add Friend
                  </button>
                  <Link to="/chat" className="px-5 py-2.5 bg-zinc-100 rounded-[8px] font-bold text-[14px] text-zinc-900 hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-sm">
                    <MessageSquare className="w-4 h-4" /> Message
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-zinc-200/60 mt-2"></div>

          {/* Facebook-style Tabs */}
          <div className="flex items-center overflow-x-auto hide-scrollbar">
            <button className="px-6 py-4 text-[15px] font-bold text-violet-600 border-b-[3px] border-indigo-600 whitespace-nowrap">Posts</button>
            <button className="px-6 py-4 text-[15px] font-bold text-zinc-500 hover:bg-zinc-50 transition-colors whitespace-nowrap">About</button>
            <button className="px-6 py-4 text-[15px] font-bold text-zinc-500 hover:bg-zinc-50 transition-colors whitespace-nowrap">Friends</button>
            <button className="px-6 py-4 text-[15px] font-bold text-zinc-500 hover:bg-zinc-50 transition-colors whitespace-nowrap">Photos</button>
          </div>
        </div>
      </div>

      {/* Main Content (Two Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 px-4 lg:px-0">
        
        {/* Left Column: Intro */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white rounded-[16px] p-5 shadow-sm border border-black/5">
            <h2 className="text-[20px] font-extrabold text-zinc-900 mb-4">Intro</h2>
            
            <p className="text-[15px] text-zinc-700 font-medium text-center mb-6 px-2 leading-relaxed">
              {profileData.bio || 'This user hasn\'t written a bio yet.'}
            </p>
            
            <div className="w-full h-px bg-zinc-200/60 mb-6"></div>

            <div className="flex flex-col gap-4 text-[14px] text-zinc-700">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-zinc-400 shrink-0" />
                <span className="font-medium">Studies <strong>{profileData.major || profileData.department || 'Undeclared'}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-zinc-400 shrink-0" />
                <span className="font-medium">Goes to <strong>{profileData.college || 'Unknown College'}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-zinc-400 shrink-0" />
                <span className="font-medium">{profileData.year || 'Unknown Year'} &bull; {profileData.semester || 'Unknown Semester'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
                <span className="font-medium">Lives in <strong>{profileData.location || 'Campus'}</strong></span>
              </div>
            </div>
            
            {isMe && (
              <Link to="/settings" className="mt-6 w-full py-2.5 bg-zinc-100 rounded-[8px] font-bold text-[14px] text-zinc-900 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                Edit Details
              </Link>
            )}
          </div>
          
          <div className="bg-white rounded-[16px] p-5 shadow-sm border border-black/5">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <h2 className="text-[20px] font-extrabold text-zinc-900 hover:underline cursor-pointer">Friends</h2>
                 <p className="text-[14px] font-medium text-zinc-500">{profileData.friendsCount} friends</p>
               </div>
               <button className="text-[14px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">See all friends</button>
             </div>
             
             {/* Mock Friends Grid */}
             <div className="grid grid-cols-3 gap-3">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="flex flex-col gap-1.5 cursor-pointer group">
                   <div className="w-full aspect-square rounded-[8px] bg-zinc-100 overflow-hidden shadow-sm">
                     <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000}?auto=format&fit=crop&w=150&q=80`} alt="Friend" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                   </div>
                   <span className="text-[12px] font-bold text-zinc-700 truncate group-hover:underline">Student {i}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[16px] p-5 shadow-sm border border-black/5">
            <h3 className="font-extrabold text-[20px] text-zinc-900 mb-6">Posts</h3>
            
            {isMe && userPosts.length === 0 && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-[12px] flex items-start gap-3">
                <Ghost className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <p className="text-[13px] font-medium text-violet-900/80 leading-relaxed">
                  <strong>Ghost Mode Notice:</strong> Posts created while Ghost Mode is active are completely anonymous and stripped of your identity. They will <span className="text-violet-600 font-bold">never</span> appear on your public profile feed.
                </p>
              </div>
            )}

            {userPosts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {userPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={() => {}} 
                    onComment={() => {}} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-black/5 rounded-[12px]">
                <Clock className="w-8 h-8 text-zinc-300 mb-3" />
                <p className="text-[15px] font-bold text-zinc-400">
                  {isMe ? "You haven't posted anything recently." : "This user hasn't posted anything recently."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
