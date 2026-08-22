import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Plus, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

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

const Discover = () => {
  const [activeTab, setActiveTab] = useState('colleges');
  const [colleges, setColleges] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef(null);
  
  // Add Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    subject: '',
    image: null
  });

  // Fetch Data
  useEffect(() => {
    const colQ = query(collection(db, 'colleges'), orderBy('rating', 'desc'));
    const teaQ = query(collection(db, 'teachers'), orderBy('rating', 'desc'));

    let colLoaded = false;
    let teaLoaded = false;

    const checkLoading = () => {
      if (colLoaded && teaLoaded) setLoading(false);
    };

    const unsubCol = onSnapshot(colQ, (snap) => {
      setColleges(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      colLoaded = true;
      checkLoading();
    });

    const unsubTea = onSnapshot(teaQ, (snap) => {
      setTeachers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      teaLoaded = true;
      checkLoading();
    });

    return () => {
      unsubCol();
      unsubTea();
    };
  }, []);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const compressed = await compressImage(file);
    setFormData(prev => ({ ...prev, image: compressed }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;
    if (activeTab === 'teachers' && !formData.subject) return;

    setIsSubmitting(true);
    try {
      const colName = activeTab === 'colleges' ? 'colleges' : 'teachers';
      const newDoc = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp()
      };

      if (activeTab === 'teachers') {
        newDoc.subject = formData.subject.trim();
      }

      if (formData.image) {
        newDoc.image = formData.image;
      }

      await addDoc(collection(db, colName), newDoc);
      
      setIsAddModalOpen(false);
      setFormData({ name: '', location: '', subject: '', image: null });
    } catch (error) {
      console.error("Failed to add entry:", error);
      alert("Error adding to directory: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = activeTab === 'colleges' ? colleges : teachers;

  return (
    <div className="w-full flex flex-col min-h-screen pb-12 animate-in fade-in">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Discover</h1>
          <p className="text-gray-500 font-medium">Find and rate the best campuses and professors.</p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Custom Segmented Control */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('colleges')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'colleges' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Colleges
            </button>
            <button 
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Teachers
            </button>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">No {activeTab} found</h3>
          <p className="text-gray-500 font-medium mb-6">Be the first to add one to the directory!</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors"
          >
            Add {activeTab === 'colleges' ? 'College' : 'Teacher'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => {
            const displayType = activeTab === 'colleges' ? 'college' : 'teacher';
            return (
              <Link to={`/discover/${displayType}/${item.id}`} key={item.id} className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all">
                
                {/* Image */}
                <div className="h-40 bg-gray-100 overflow-hidden relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-900">{Number(item.rating || 0).toFixed(1)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm font-medium mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </div>
                  
                  {item.subject && (
                    <div className="mt-auto">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {item.subject}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">{item.reviewCount || 0} reviews</span>
                    <span className="text-blue-600 font-bold group-hover:underline">View Details</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">
                Add {activeTab === 'colleges' ? 'College' : 'Teacher'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              
              {/* Photo Upload */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-gray-700">Cover Photo (Optional)</label>
                <div 
                  className="relative group cursor-pointer w-full h-32 rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center"
                  onClick={() => imageInputRef.current?.click()}
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs font-medium">Click to upload</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={handleImageSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  placeholder={activeTab === 'colleges' ? 'e.g. Stanford University' : 'e.g. Dr. Alan Turing'}
                  required
                />
              </div>

              {activeTab === 'teachers' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    placeholder="e.g. Computer Science"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  placeholder="e.g. Stanford, CA"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full font-bold text-sm bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add to Directory
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Discover;
