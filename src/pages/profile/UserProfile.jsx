import { useState, useEffect } from 'react';
import { MapPin, Calendar, Link as LinkIcon, BookOpen, Users, Heart, MessageCircle, Share2, Bookmark, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const UserProfile = () => {
  const { currentUser } = useAuth();
  
  // State for fetching user profile from Firestore
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: ''
  });

  // Fetch Firestore User Document on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.uid) return;
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
          setEditForm({
            displayName: currentUser.displayName || '',
            bio: docSnap.data().bio || '',
            location: docSnap.data().location || ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Update Auth Profile (Display Name)
      if (editForm.displayName !== currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: editForm.displayName
        });
      }

      // 2. Update Firestore Document (Bio, Location, etc.)
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: editForm.displayName,
        bio: editForm.bio,
        location: editForm.location
      });

      // Update local state to reflect changes instantly
      setProfileData(prev => ({ ...prev, bio: editForm.bio, location: editForm.location }));
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const defaultHandle = currentUser?.email ? currentUser.email.split('@')[0] : 'student';

  if (loadingProfile) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-12 relative">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Cover Photo */}
        <div className="h-40 sm:h-48 w-full bg-gray-200 relative">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80" 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info Section */}
        <div className="px-5 sm:px-8 relative">
          
          {/* Avatar & Edit Button Row */}
          <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4 relative z-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm flex items-center justify-center text-3xl font-bold text-gray-500">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white border border-gray-300 text-gray-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm mb-2 sm:mb-4 active:scale-95"
            >
              Edit Profile
            </button>
          </div>

          {/* Bio & Details */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {currentUser?.displayName || 'Campus Student'}
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
          <button className="flex-1 py-4 text-sm font-bold text-gray-900 border-b-2 border-black hover:bg-gray-100 transition-colors">Posts</button>
          <button className="flex-1 py-4 text-sm font-bold text-gray-500 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-900 transition-colors">Replies</button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
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

              <div className="pt-4 flex justify-end gap-3">
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

      {/* User's Dummy Feed (Placeholder) */}
      <div className="flex flex-col gap-5">
        <article className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm opacity-60">
          <div className="text-center py-8">
            <h4 className="font-bold text-gray-900 mb-2">No posts yet</h4>
            <p className="text-sm text-gray-500">When you post something, it will show up here.</p>
          </div>
        </article>
      </div>

    </div>
  );
};

export default UserProfile;
