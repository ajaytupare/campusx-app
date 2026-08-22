import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, X, Loader2, Camera, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, updateDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import PostCard from '../../components/feed/PostCard';

const DEFAULT_COVER = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";

const UserProfile = () => {
  const { currentUser, userData } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState('Posts');

  // Posts State
  const [userPosts, setUserPosts] = useState([]);
  const [repliedPosts, setRepliedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setProfileData(userData);
      setEditForm(prev => ({
        displayName: userData.displayName || currentUser?.displayName || '',
        bio: userData.bio || '',
        location: userData.location || ''
      }));
      setLoadingProfile(false);
    }
  }, [userData, currentUser]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    
    // Fetch Authored Posts
    const qPosts = query(
      collection(db, 'posts'), 
      where('authorId', '==', currentUser.uid),
      where('isGhost', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserPosts(fetchedPosts);
      setLoadingPosts(false);
    });

    // Fetch Replied Posts
    const qReplies = query(
      collection(db, 'posts'), 
      where('commentedBy', 'array-contains', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubReplies = onSnapshot(qReplies, (snapshot) => {
      const fetchedReplies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRepliedPosts(fetchedReplies);
    });

    return () => {
      unsubPosts();
      unsubReplies();
    };
  }, [currentUser]);

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        let max_width = type === 'cover' ? 800 : 250;
        let max_height = type === 'cover' ? 400 : 250;
        
        if (width > height) {
          if (width > max_width) {
            height = Math.round((height *= max_width / width));
            width = max_width;
          }
        } else {
          if (height > max_height) {
            width = Math.round((width *= max_height / height));
            height = max_height;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        
        if (type === 'cover') {
          setCoverPreview(compressedBase64);
        } else {
          setAvatarPreview(compressedBase64);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);

    try {
      if (editForm.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: editForm.displayName });
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: editForm.displayName,
        bio: editForm.bio,
        location: editForm.location,
        ...(avatarPreview && avatarPreview !== userData?.photoURL && { photoURL: avatarPreview }),
        ...(coverPreview && coverPreview !== userData?.coverPhotoURL && { coverPhotoURL: coverPreview })
      });
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const defaultHandle = currentUser?.email ? currentUser.email.split('@')[0] : 'student';
  const displayPhoto = userData?.photoURL || currentUser?.photoURL;
  const displayCover = userData?.coverPhotoURL || DEFAULT_COVER;
  const displayName = userData?.displayName || currentUser?.displayName || 'Campus Student';

  if (loadingProfile) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>;
  }

  const currentFeed = activeTab === 'Posts' ? userPosts : repliedPosts;

  return (
    <div className="flex flex-col gap-6 pb-12 relative">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        
        <div className="h-40 sm:h-48 w-full bg-gray-200 relative">
          <img 
            src={displayCover} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-5 sm:px-8 relative">
          
          <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4 relative z-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm flex items-center justify-center text-3xl font-bold text-gray-500">
              {displayPhoto ? (
                <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <button 
              onClick={() => {
                setAvatarPreview(displayPhoto || null);
                setCoverPreview(displayCover || null);
                setIsEditModalOpen(true);
              }}
              className="bg-white border border-gray-300 text-gray-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm mb-2 sm:mb-4 active:scale-95"
            >
              Edit Profile
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {displayName}
            </h1>
            <p className="text-gray-500 font-medium text-sm mb-3">@{defaultHandle} &bull; {profileData?.role || 'Member'}</p>
            
            <p className="text-gray-800 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
              {profileData?.bio || "Welcome to my CampusX profile! I haven't written a bio yet."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
              {profileData?.location && (
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profileData.location}</div>
              )}
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined recently</div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-gray-200 bg-gray-50/50">
          <button 
            onClick={() => setActiveTab('Posts')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === 'Posts' ? 'text-gray-900 border-b-2 border-black bg-white' : 'text-gray-500 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Posts
          </button>
          <button 
            onClick={() => setActiveTab('Replies')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === 'Replies' ? 'text-gray-900 border-b-2 border-black bg-white' : 'text-gray-500 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Replies
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 bg-white z-10">
              <h3 className="font-bold text-lg">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-gray-700">Cover Photo</label>
                <div className="relative group cursor-pointer w-full h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-100 hover:border-gray-300 transition-colors" onClick={() => coverInputRef.current?.click()}>
                  <img src={coverPreview || DEFAULT_COVER} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={coverInputRef} 
                  onChange={(e) => handleImageSelect(e, 'cover')} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-gray-700">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer w-20 h-20 shrink-0" onClick={() => avatarInputRef.current?.click()}>
                    <div className="w-full h-full rounded-full border-4 border-gray-100 bg-gray-100 overflow-hidden flex items-center justify-center">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => avatarInputRef.current?.click()}
                    className="text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                  >
                    Change Photo
                  </button>
                  <input 
                    type="file" 
                    ref={avatarInputRef} 
                    onChange={(e) => handleImageSelect(e, 'avatar')} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                <input 
                  type="text" 
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                <textarea 
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Tell people about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location / Campus Area</label>
                <input 
                  type="text" 
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  placeholder="e.g. North Campus, Seattle WA"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                />
              </div>
            </form>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 rounded-full font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full font-bold text-sm bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* User's Actual Feed */}
      <div className="flex flex-col gap-5">
        {loadingPosts ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : currentFeed.length === 0 ? (
          <article className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
            <div className="text-center py-8">
              <h4 className="font-bold text-gray-900 mb-2">
                {activeTab === 'Posts' ? 'No posts yet' : 'No replies yet'}
              </h4>
              <p className="text-sm text-gray-500">
                {activeTab === 'Posts' 
                  ? 'When you share something on campus, it will appear here.'
                  : 'When you reply to posts, they will appear here.'}
              </p>
            </div>
          </article>
        ) : (
          currentFeed.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

    </div>
  );
};

export default UserProfile;
