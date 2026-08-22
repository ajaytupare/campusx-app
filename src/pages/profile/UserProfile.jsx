import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, X, Loader2, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import PostCard from '../../components/feed/PostCard';

const UserProfile = () => {
  const { currentUser, userData } = useAuth(); // Using userData from Context
  
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: ''
  });
  
  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // We already have userData globally from AuthContext, but we can also rely on it here!
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
    
    const q = query(
      collection(db, 'posts'), 
      where('authorId', '==', currentUser.uid),
      where('isGhost', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserPosts(fetchedPosts);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize down to 250x250 max
        const MAX_SIZE = 250;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height *= MAX_SIZE / width));
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width *= MAX_SIZE / height));
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress aggressively to JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setAvatarPreview(compressedBase64);
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
      // ONLY update displayName in Firebase Auth (to prevent photoURL size limit crash)
      if (editForm.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: editForm.displayName });
      }

      // Update everything, including photoURL (Base64), inside Firestore!
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: editForm.displayName,
        bio: editForm.bio,
        location: editForm.location,
        ...(avatarPreview && avatarPreview !== userData?.photoURL && { photoURL: avatarPreview })
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
  const displayName = userData?.displayName || currentUser?.displayName || 'Campus Student';

  if (loadingProfile) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-12 relative">
      
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-40 sm:h-48 w-full bg-gray-200 relative">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80" 
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

        <div className="flex border-t border-gray-200 bg-gray-50/50">
          <button className="flex-1 py-4 text-sm font-bold text-gray-900 border-b-2 border-black hover:bg-gray-100 transition-colors">Posts</button>
          <button className="flex-1 py-4 text-sm font-bold text-gray-500 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-not-allowed opacity-50">Replies</button>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full border-4 border-gray-100 bg-gray-100 overflow-hidden flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Change Profile Photo
                </button>
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

              <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full font-bold text-sm bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* User's Actual Feed */}
      <div className="flex flex-col gap-5">
        {loadingPosts ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : userPosts.length === 0 ? (
          <article className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
            <div className="text-center py-8">
              <h4 className="font-bold text-gray-900 mb-2">No posts yet</h4>
              <p className="text-sm text-gray-500">When you share something on campus, it will appear here.</p>
            </div>
          </article>
        ) : (
          userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

    </div>
  );
};

export default UserProfile;
