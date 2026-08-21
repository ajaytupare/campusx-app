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
      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
        <h2 className="text-[22px] font-semibold text-[var(--cx-text-main)] mb-2">User Not Found</h2>
        <p className="text-[15px] font-normal text-[var(--cx-text-muted)]">This profile doesn't exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full max-w-[980px] mx-auto gap-5 pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/[0.04]">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-64 lg:h-72 w-full relative bg-[var(--cx-bg-base)]">
          <img src={profileData.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Profile Header Info */}
        <div className="px-5 sm:px-8 relative">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-14 sm:-mt-20 mb-4 gap-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 z-10 w-full">
              {/* Avatar */}
              <div className="w-28 h-28 sm:w-[152px] sm:h-[152px] rounded-full border-[3px] border-white overflow-hidden bg-[var(--cx-bg-base)] shadow-[0_2px_12px_rgba(0,0,0,0.1)] shrink-0">
                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Name & Basic Info */}
              <div className="flex-1 pb-2 sm:pb-5 w-full">
                <h1 className="text-[28px] sm:text-[34px] font-bold text-[var(--cx-text-main)] tracking-tight leading-tight mb-1">{profileData.name || 'Anonymous Student'}</h1>
                <p className="text-[15px] font-medium text-[var(--cx-text-muted)]">
                  <span className="text-[var(--cx-text-main)] font-semibold">{profileData.friendsCount}</span> friends
                </p>
                
                {/* Mobile action buttons */}
                <div className="flex items-center gap-2.5 mt-4 sm:hidden w-full">
                  {isMe ? (
                    <Link to="/settings" className="flex-1 py-2.5 bg-[var(--cx-bg-base)] rounded-full font-semibold text-[14px] text-[var(--cx-text-main)] text-center flex items-center justify-center gap-2 hover:bg-black/[0.08] transition-all duration-200">
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </Link>
                  ) : (
                    <>
                      <button className="flex-1 py-2.5 bg-[var(--cx-primary)] text-white rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[var(--cx-accent)] transition-all duration-200">
                        <UserPlus className="w-4 h-4" /> Add Friend
                      </button>
                      <Link to="/chat" className="flex-1 py-2.5 bg-[var(--cx-bg-base)] rounded-full font-semibold text-[14px] text-[var(--cx-text-main)] text-center flex items-center justify-center gap-2 hover:bg-black/[0.08] transition-all duration-200">
                        <MessageSquare className="w-4 h-4" /> Message
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5 pb-5 shrink-0">
              {isMe ? (
                <Link 
                  to="/settings"
                  className="px-5 py-2.5 bg-[var(--cx-bg-base)] rounded-full font-semibold text-[14px] text-[var(--cx-text-main)] hover:bg-black/[0.08] transition-all duration-200 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Link>
              ) : (
                <>
                  <button className="px-5 py-2.5 bg-[var(--cx-primary)] text-white rounded-full font-semibold text-[14px] hover:bg-[var(--cx-accent)] transition-all duration-200 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Add Friend
                  </button>
                  <Link to="/chat" className="px-5 py-2.5 bg-[var(--cx-bg-base)] rounded-full font-semibold text-[14px] text-[var(--cx-text-main)] hover:bg-black/[0.08] transition-all duration-200 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Message
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-black/[0.04] mt-1"></div>

          {/* Tabs */}
          <div className="flex items-center overflow-x-auto hide-scrollbar">
            <button className="px-5 py-3.5 text-[14px] font-semibold text-[var(--cx-text-main)] border-b-2 border-[var(--cx-text-main)] whitespace-nowrap">Posts</button>
            <button className="px-5 py-3.5 text-[14px] font-medium text-[var(--cx-text-muted)] hover:bg-black/[0.03] transition-all duration-200 whitespace-nowrap">About</button>
            <button className="px-5 py-3.5 text-[14px] font-medium text-[var(--cx-text-muted)] hover:bg-black/[0.03] transition-all duration-200 whitespace-nowrap">Friends</button>
            <button className="px-5 py-3.5 text-[14px] font-medium text-[var(--cx-text-muted)] hover:bg-black/[0.03] transition-all duration-200 whitespace-nowrap">Photos</button>
          </div>
        </div>
      </div>

      {/* Main Content (Two Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 px-4 lg:px-0">
        
        {/* Left Column: Intro */}
        <div className="flex flex-col gap-5">
          
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
            <h2 className="text-[20px] font-semibold text-[var(--cx-text-main)] mb-4">Intro</h2>
            
            <p className="text-[15px] text-[var(--cx-text-main)]/70 font-normal text-center mb-5 px-1 leading-relaxed">
              {profileData.bio || 'This user hasn\'t written a bio yet.'}
            </p>
            
            <div className="w-full h-px bg-black/[0.04] mb-5"></div>

            <div className="flex flex-col gap-3.5 text-[14px] text-[var(--cx-text-main)]/80">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-[18px] h-[18px] text-[var(--cx-text-muted)] shrink-0" />
                <span className="font-normal">Studies <strong className="font-semibold">{profileData.major || profileData.department || 'Undeclared'}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-[18px] h-[18px] text-[var(--cx-text-muted)] shrink-0" />
                <span className="font-normal">Goes to <strong className="font-semibold">{profileData.college || 'Unknown College'}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-[18px] h-[18px] text-[var(--cx-text-muted)] shrink-0" />
                <span className="font-normal">{profileData.year || 'Unknown Year'} &bull; {profileData.semester || 'Unknown Semester'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-[18px] h-[18px] text-[var(--cx-text-muted)] shrink-0" />
                <span className="font-normal">Lives in <strong className="font-semibold">{profileData.location || 'Campus'}</strong></span>
              </div>
            </div>
            
            {isMe && (
              <Link to="/settings" className="mt-5 w-full py-2.5 bg-[var(--cx-bg-base)] rounded-xl font-semibold text-[14px] text-[var(--cx-text-main)] flex items-center justify-center hover:bg-black/[0.06] transition-all duration-200">
                Edit Details
              </Link>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <h2 className="text-[20px] font-semibold text-[var(--cx-text-main)] hover:underline cursor-pointer">Friends</h2>
                 <p className="text-[13px] font-medium text-[var(--cx-text-muted)] mt-0.5">{profileData.friendsCount} friends</p>
               </div>
               <button className="text-[14px] font-medium text-[var(--cx-primary)] hover:bg-[var(--cx-primary)]/[0.06] px-3 py-1.5 rounded-lg transition-all duration-200">See all</button>
             </div>
             
             {/* Mock Friends Grid */}
             <div className="grid grid-cols-3 gap-3">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="flex flex-col gap-1.5 cursor-pointer group">
                   <div className="w-full aspect-square rounded-xl bg-[var(--cx-bg-base)] overflow-hidden">
                     <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000}?auto=format&fit=crop&w=150&q=80`} alt="Friend" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                   </div>
                   <span className="text-[12px] font-medium text-[var(--cx-text-main)] truncate group-hover:underline">Student {i}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
            <h3 className="font-semibold text-[20px] text-[var(--cx-text-main)] mb-5">Posts</h3>
            
            {isMe && userPosts.length === 0 && (
              <div className="mb-5 p-4 bg-[var(--cx-ghost-start)]/[0.06] border border-[var(--cx-ghost-start)]/[0.08] rounded-xl flex items-start gap-3">
                <Ghost className="w-[18px] h-[18px] text-[var(--cx-ghost-start)] shrink-0 mt-0.5" />
                <p className="text-[13px] font-normal text-[var(--cx-text-main)]/70 leading-relaxed">
                  <strong className="font-semibold">Ghost Mode Notice:</strong> Posts created while Ghost Mode is active are completely anonymous and stripped of your identity. They will <span className="text-[var(--cx-ghost-start)] font-semibold">never</span> appear on your public profile feed.
                </p>
              </div>
            )}

            {userPosts.length > 0 ? (
              <div className="flex flex-col gap-5">
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
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[var(--cx-text-muted)] rounded-2xl">
                <Clock className="w-7 h-7 text-[var(--cx-text-muted)] mb-3" />
                <p className="text-[15px] font-medium text-[var(--cx-text-muted)]">
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

