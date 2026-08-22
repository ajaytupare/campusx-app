import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Users, ChevronDown, X, ImagePlus, Check, Loader2, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// Utility to compress image to a highly efficient Base64 string
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};

const Clubs = () => {
  const { currentUser } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clubToDelete, setClubToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'STEM',
    description: '',
    image: null,
    logo: null
  });

  const categories = ['All', 'STEM', 'Academic', 'Social', 'Business', 'Arts', 'Sports'];

  // Fetch Clubs Real-time
  useEffect(() => {
    const q = query(collection(db, 'clubs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedClubs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClubs(fetchedClubs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Image Selection
  const handleImageSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const compressed = await compressImage(file);
    if (type === 'banner') {
      setFormData(prev => ({ ...prev, image: compressed }));
    } else {
      setFormData(prev => ({ ...prev, logo: compressed }));
    }
  };

  // Handle Create Club
  const handleCreateClub = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      const newClub = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        creatorId: currentUser.uid,
        memberIds: [currentUser.uid], // Creator is automatically a member
        createdAt: serverTimestamp(),
        image: formData.image,
        logo: formData.logo
      };

      await addDoc(collection(db, 'clubs'), newClub);
      
      setIsCreateModalOpen(false);
      setFormData({ name: '', category: 'STEM', description: '', image: null, logo: null });
    } catch (error) {
      console.error("Error creating club:", error);
      alert("Failed to create club: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Club
  const handleDeleteClub = async () => {
    if (!clubToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'clubs', clubToDelete.id));
      setClubToDelete(null);
    } catch (error) {
      console.error("Error deleting club:", error);
      alert("Failed to delete: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Join / Leave
  const handleJoinLeave = async (clubId, isMember) => {
    if (!currentUser) return;
    try {
      const clubRef = doc(db, 'clubs', clubId);
      if (isMember) {
        await updateDoc(clubRef, {
          memberIds: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(clubRef, {
          memberIds: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error updating membership:", error);
    }
  };

  // Filter Clubs
  const filteredClubs = clubs.filter(club => {
    const matchesCategory = activeCategory === 'All' || club.category === activeCategory;
    const matchesSearch = club.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col min-h-screen pb-12 animate-in fade-in">
      
      {/* Header & Create Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Clubs & Organizations</h1>
          <p className="text-gray-500 font-medium">Find your community. Join clubs, attend events, and connect.</p>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#1D9BF0] hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" /> Create Club
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 flex flex-col lg:flex-row items-center gap-2 mb-10 overflow-hidden">
        
        {/* Search */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full border-b lg:border-b-0 lg:border-r border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a club or organization..." 
              className="w-full text-sm outline-none placeholder-gray-400 bg-transparent" 
            />
          </div>
        </div>

        {/* Categories Scrollable Row */}
        <div className="flex items-center gap-2 px-4 py-2 w-full lg:w-auto overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                ? 'bg-black text-white' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : filteredClubs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">No clubs found</h3>
          <p className="text-gray-500 font-medium mb-6">Start your own community!</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors"
          >
            Create a Club
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const isMember = currentUser && club.memberIds?.includes(currentUser.uid);
            const memberCount = club.memberIds?.length || 0;

            return (
              <Link to={`/clubs/${club.id}`} key={club.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all flex flex-col">
                {/* Banner & Logo */}
                <div className="h-32 bg-gray-100 relative">
                  {club.image ? (
                    <img src={club.image} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100"></div>
                  )}
                  
                  <div className="absolute -bottom-6 left-5">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border-2 border-white overflow-hidden flex items-center justify-center font-bold text-xl text-gray-400">
                      {club.logo ? (
                        <img src={club.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        club.name?.charAt(0)
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">{club.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-9 p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{club.name}</h3>
                    {currentUser && club.creatorId === currentUser.uid && (
                      <button 
                        onClick={(e) => { e.preventDefault(); setClubToDelete(club); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Delete Club"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{club.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                      <Users className="w-4 h-4" />
                      {memberCount} member{memberCount !== 1 ? 's' : ''}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.preventDefault(); handleJoinLeave(club.id, isMember); }}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                        isMember 
                        ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' 
                        : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isMember ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {clubToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Club?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <strong>{clubToDelete.name}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setClubToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteClub}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Club Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-extrabold text-gray-900">Start a New Club</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="flex flex-col max-h-[80vh]">
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                
                {/* Media Uploads */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Photo</label>
                    <div 
                      onClick={() => bannerInputRef.current?.click()}
                      className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden"
                    >
                      {formData.image ? (
                        <img src={formData.image} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                          <span className="text-xs font-medium text-gray-500">Upload Banner</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={bannerInputRef} onChange={(e) => handleImageSelect(e, 'banner')} accept="image/*" className="hidden" />
                  </div>

                  <div className="w-24">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Logo</label>
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden"
                    >
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                          <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input type="file" ref={logoInputRef} onChange={(e) => handleImageSelect(e, 'logo')} accept="image/*" className="hidden" />
                  </div>
                </div>

                {/* Text Inputs */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Club Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Debate Society" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium appearance-none"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="What is this club about?" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium min-h-[100px] resize-y"
                    required
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-5 py-2.5 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-2.5 font-bold text-sm shadow-sm transition-all active:scale-95 min-w-[140px] disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {isSubmitting ? 'Creating...' : 'Create Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Clubs;
