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
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto gap-6 pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-[var(--cx-bg-surface)] rounded-[32px] overflow-hidden shadow-sm border border-[var(--cx-text-muted)]/10">
        
        {/* Cover Photo */}
        <div className="h-48 w-full relative">
          <img src={profileData.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Info Section */}
        <div className="px-8 pb-8 relative">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 mb-6 gap-4">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-[var(--cx-bg-surface)] overflow-hidden bg-[var(--cx-bg-base)] shadow-md relative z-10 shrink-0">
              <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isMe ? (
                <Link 
                  to="/settings"
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-[12px] font-bold text-[14px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Link>
              ) : (
                <>
                  <button className="flex-1 sm:flex-none px-6 py-2.5 bg-[var(--cx-primary)] text-white rounded-[12px] font-bold text-[14px] hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20">
                    <UserPlus className="w-4 h-4" /> Add Friend
                  </button>
                  <Link to="/chat" className="flex-1 sm:flex-none px-6 py-2.5 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/20 rounded-[12px] font-bold text-[14px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Message
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--cx-text-main)] tracking-tight mb-1">{profileData.name || 'Anonymous Student'}</h1>
            <p className="text-[16px] font-bold text-[var(--cx-text-muted)] mb-4">{profileData.major || profileData.department || 'Undeclared Major'}</p>
            
            <p className="text-[15px] text-[var(--cx-text-main)] font-medium leading-relaxed mb-6 max-w-2xl whitespace-pre-wrap">
              {profileData.bio || 'This user hasn\'t written a bio yet.'}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-[14px] font-semibold text-[var(--cx-text-muted)]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[var(--cx-primary)]" />
                {profileData.college || 'Unknown College'}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--cx-primary)]" />
                {profileData.year || 'Unknown Year'} &bull; {profileData.semester || 'Unknown Semester'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--cx-primary)]" />
                {profileData.location || 'Campus'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[var(--cx-text-main)]">{profileData.friendsCount}</span> Friends
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-[var(--cx-bg-surface)] rounded-[32px] p-8 shadow-sm border border-[var(--cx-text-muted)]/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-extrabold text-[18px] text-[var(--cx-text-main)]">Recent Activity</h3>
        </div>
        
        {isMe && userPosts.length === 0 && (
          <div className="mb-6 p-4 bg-[var(--cx-ghost-start)]/10 border border-[var(--cx-ghost-start)]/20 rounded-[16px] flex items-start gap-3">
            <Ghost className="w-5 h-5 text-[var(--cx-ghost-start)] shrink-0 mt-0.5" />
            <p className="text-[13px] font-medium text-[var(--cx-text-main)]">
              <strong>Ghost Mode Notice:</strong> Posts created while Ghost Mode is active are completely anonymous and stripped of your identity. They will <span className="text-[var(--cx-ghost-start)] font-bold">never</span> appear on your public profile feed.
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
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[var(--cx-text-muted)]/10 rounded-[24px]">
            <Clock className="w-8 h-8 text-[var(--cx-text-muted)]/30 mb-3" />
            <p className="text-[15px] font-medium text-[var(--cx-text-muted)]">
              {isMe ? "You haven't posted anything recently." : "This user hasn't posted anything recently."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
