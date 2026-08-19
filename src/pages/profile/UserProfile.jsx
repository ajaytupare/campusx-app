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
  
  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(''); 
  const [editAvatar, setEditAvatar] = useState(''); 
  const [editCover, setEditCover] = useState(''); 
  const [editMajor, setEditMajor] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');

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
      
      // Init edit form with fallbacks to prevent undefined wiping data
      setEditName(storedProfile.name || '');
      setEditAvatar(storedProfile.avatar || '');
      setEditCover(storedProfile.cover || '');
      setEditMajor(storedProfile.major || storedProfile.department || '');
      setEditCollege(storedProfile.college || '');
      setEditSemester(storedProfile.semester || '');
      setEditYear(storedProfile.year || '');
      setEditBio(storedProfile.bio || '');
      setEditLocation(storedProfile.location || '');
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Firestore strictly rejects 'undefined' values. We must sanitize them.
    const sanitize = (val) => val === undefined ? null : val;
    
    let updatedProfile = {
      ...profileData,
      name: sanitize(editName),
      avatar: sanitize(editAvatar),
      cover: sanitize(editCover),
      major: sanitize(editMajor),
      college: sanitize(editCollege),
      semester: sanitize(editSemester),
      year: sanitize(editYear),
      bio: sanitize(editBio),
      location: sanitize(editLocation)
    };
    
    // Deep strip any undefined values that might have sneaked in from profileData
    Object.keys(updatedProfile).forEach(key => {
      if (updatedProfile[key] === undefined) {
        updatedProfile[key] = null;
      }
    });
    
    setProfileData(updatedProfile);
    
    try {
      // Save to localStorage for immediate UI sync (sidebar etc.)
      localStorage.setItem('cx_current_user_profile', JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('storage'));
      
      // Save to Firestore
      if (currentUser?.uid) {
        await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true });
        
        // Note: For a production app, we would use a Cloud Function or Batch Write to update
        // all existing posts to reflect the new name. For this prototype, we'll just update 
        // the user's profile document.
      }
    } catch (err) {
      console.warn("Could not save profile properly.", err);
      alert("Database Sync Failed: " + err.message);
    }
    
    setIsEditModalOpen(false);
  };

  const handleFileUpload = (e, setFileState) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using canvas to ensure it fits in Firestore 1MB limit
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension 800px
          const MAX_DIMENSION = 800;
          if (width > height && width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as JPEG with 0.7 quality to reduce size
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFileState(compressedDataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

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
        <div className="px-6 sm:px-8 pb-8 relative">
          
          <div className="flex justify-between items-end mb-4 sm:mb-6">
            {/* Avatar */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-[6px] border-[var(--cx-bg-surface)] overflow-hidden bg-[var(--cx-bg-base)] shadow-md relative z-10 shrink-0 -mt-16 sm:-mt-20">
              <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isMe ? (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-5 py-2 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/30 rounded-full font-bold text-[14px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <Link to="/chat" className="px-4 py-2 bg-[var(--cx-bg-base)] border border-[var(--cx-text-muted)]/30 rounded-full font-bold text-[14px] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <button className="px-6 py-2 bg-[var(--cx-primary)] text-white rounded-full font-bold text-[14px] hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20">
                    <UserPlus className="w-4 h-4" /> Follow
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--cx-text-main)] tracking-tight mb-1">{profileData.name || 'Anonymous Student'}</h1>
            <p className="text-[15px] sm:text-[16px] font-bold text-[var(--cx-text-muted)] mb-4">
              {profileData.major || profileData.department || 'Undeclared Major'} &bull; {profileData.college || 'Unknown College'}
            </p>
            
            <p className="text-[14px] sm:text-[15px] text-[var(--cx-text-main)] font-medium leading-relaxed mb-5 max-w-3xl whitespace-pre-wrap">
              {profileData.bio || 'This user hasn\'t written a bio yet.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[13px] sm:text-[14px] font-semibold text-[var(--cx-text-muted)] mb-5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[var(--cx-primary)]" />
                {profileData.year || 'Unknown Year'} &bull; {profileData.semester || 'Unknown Semester'}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--cx-primary)]" />
                {profileData.location || 'Campus'}
              </div>
            </div>

            {/* Subtle Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <span className="font-extrabold text-[var(--cx-text-main)] text-[16px]">{profileData.friendsCount || 0}</span>
                <span className="text-[14px] font-medium text-[var(--cx-text-muted)]">Followers</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <span className="font-extrabold text-[var(--cx-text-main)] text-[16px]">{Math.floor((profileData.friendsCount || 0) * 0.8)}</span>
                <span className="text-[14px] font-medium text-[var(--cx-text-muted)]">Following</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <span className="font-extrabold text-[var(--cx-text-main)] text-[16px]">{userPosts.length}</span>
                <span className="text-[14px] font-medium text-[var(--cx-text-muted)]">Posts</span>
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

      {/* Edit Profile Modal */}
      {isMe && isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--cx-bg-surface)] w-full max-w-lg rounded-[32px] p-8 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 my-8">
            <h2 className="text-2xl font-extrabold text-[var(--cx-text-main)] tracking-tight mb-6">Edit Profile</h2>
            
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Avatar Image</label>
                  <label className="w-full flex items-center justify-center gap-2 bg-[var(--cx-bg-base)] border border-dashed border-[var(--cx-text-muted)]/30 rounded-[16px] px-4 py-3 text-[15px] cursor-pointer hover:bg-zinc-200 transition-colors text-[var(--cx-text-main)] font-medium">
                    <Upload className="w-4 h-4" /> {editAvatar?.startsWith('data:') ? 'Image Selected' : 'Choose File'}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setEditAvatar)}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Cover Image</label>
                  <label className="w-full flex items-center justify-center gap-2 bg-[var(--cx-bg-base)] border border-dashed border-[var(--cx-text-muted)]/30 rounded-[16px] px-4 py-3 text-[15px] cursor-pointer hover:bg-zinc-200 transition-colors text-[var(--cx-text-main)] font-medium">
                    <Upload className="w-4 h-4" /> {editCover?.startsWith('data:') ? 'Image Selected' : 'Choose File'}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setEditCover)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">College</label>
                  <input 
                    type="text" 
                    value={editCollege}
                    onChange={e => setEditCollege(e.target.value)}
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Department / Major</label>
                  <input 
                    type="text" 
                    value={editMajor}
                    onChange={e => setEditMajor(e.target.value)}
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Year</label>
                  <input 
                    type="text" 
                    value={editYear}
                    onChange={e => setEditYear(e.target.value)}
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Semester</label>
                  <input 
                    type="text" 
                    value={editSemester}
                    onChange={e => setEditSemester(e.target.value)}
                    className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Campus Location</label>
                <input 
                  type="text" 
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[var(--cx-text-muted)] mb-1.5">Bio</label>
                <textarea 
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-[16px] px-4 py-3 text-[15px] outline-none resize-none min-h-[100px] transition-all focus:border-[var(--cx-primary)]/30 text-[var(--cx-text-main)] font-medium"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3.5 rounded-[16px] font-bold text-[14px] bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 rounded-[16px] font-bold text-[14px] bg-[var(--cx-primary)] text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;
