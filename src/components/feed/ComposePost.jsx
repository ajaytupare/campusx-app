import { useState, useRef } from 'react';
import { Image as ImageIcon, BarChart2, Quote, X, Ghost, Loader2, Calendar, Tag, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Utility to compress image to a highly efficient Base64 string (avoids Firebase Storage issues)
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
        // Compress to 0.7 quality JPEG (usually 50-100kb, perfectly safe for Firestore 1MB limit)
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });
};

const ComposePost = ({ onPostSuccess, isModal = false, onClose }) => {
  const { currentUser, userData } = useAuth();
  const { isGhostMode } = useGhost();
  
  const [postText, setPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  // Post Type State: 'text' | 'poll' | 'image' | 'event' | 'market'
  const [activeType, setActiveType] = useState('text');
  
  // Specific Data States
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [eventData, setEventData] = useState({ title: '', date: '', time: '', location: '' });
  const [marketData, setMarketData] = useState({ title: '', price: '' });
  
  // Image Upload States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 5MB.");
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeType = () => {
    setActiveType('text');
    setPollOptions(['', '']);
    setImageFile(null);
    setImagePreview('');
    setEventData({ title: '', date: '', time: '', location: '' });
    setMarketData({ title: '', price: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    
    // Require main text only if it's a standard text post
    if (activeType === 'text' && !postText.trim()) {
      alert("Please write something to post!");
      return;
    }
    
    if (activeType === 'poll') {
      const validOptions = pollOptions.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        alert("A poll must have at least 2 options!");
        return;
      }
    }

    if (activeType === 'event' && (!eventData.title || !eventData.date || !eventData.time || !eventData.location)) {
      alert("Please fill out all event details!");
      return;
    }

    if (activeType === 'market' && (!marketData.title || !marketData.price)) {
      alert("Please provide an item name and price!");
      return;
    }

    if (activeType === 'image' && !imageFile) {
      alert("Please select an image to upload!");
      return;
    }

    setIsPosting(true);
    try {
      const postData = {
        content: postText.trim(),
        authorId: currentUser.uid,
        authorName: isGhostMode ? 'Ghost' : (currentUser.displayName || 'Campus Student'),
        authorAvatar: isGhostMode ? null : ((userData?.photoURL || currentUser?.photoURL) || null),
        type: isGhostMode ? 'ghost' : activeType, 
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        isGhost: isGhostMode
      };

      if (activeType === 'poll') {
        postData.type = 'poll';
        postData.pollData = pollOptions
          .filter(opt => opt.trim() !== '')
          .map(opt => ({ option: opt.trim(), votes: 0, percent: 0 }));
        postData.totalVotes = 0;
      } else if (activeType === 'event') {
        postData.type = 'event';
        postData.eventData = eventData;
      } else if (activeType === 'market') {
        postData.type = 'market';
        postData.marketData = marketData;
        if (imageFile) {
          const compressedBase64 = await compressImage(imageFile);
          postData.marketData.image = compressedBase64;
        }
      } else if (activeType === 'image' && imageFile) {
        // Compress image and save as highly optimized Base64 string to bypass Storage timeout issues
        const compressedBase64 = await compressImage(imageFile);
        postData.type = 'image';
        postData.postImage = compressedBase64;
      }

      await addDoc(collection(db, 'posts'), postData);
      
      setPostText('');
      removeType();
      
      if (onPostSuccess) onPostSuccess();
      if (onClose) onClose();

    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const getInputClass = () => {
    return `w-full px-4 py-2 rounded-lg border text-sm font-medium focus:outline-none ${
      isGhostMode 
        ? 'bg-purple-900/50 border-purple-500/50 text-white placeholder-purple-300 focus:border-purple-300' 
        : 'bg-white border-gray-200 focus:border-black'
    }`;
  };

  const getContainerClass = () => {
    return `mt-3 p-4 rounded-xl border ${isGhostMode ? 'border-purple-500/30 bg-purple-900/20' : 'border-gray-200 bg-gray-50'}`;
  };

  const renderHeader = (title) => (
    <div className="flex justify-between items-center mb-3">
      <span className={`text-xs font-bold uppercase tracking-wider ${isGhostMode ? 'text-purple-300' : 'text-gray-500'}`}>{title}</span>
      <button onClick={removeType} className={`${isGhostMode ? 'text-purple-300 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><X className="w-4 h-4" /></button>
    </div>
  );

  return (
    <div className={`flex gap-4 ${isModal ? 'p-0' : ''}`}>
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-xl transition-colors ${
        isGhostMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {isGhostMode ? (
          <Ghost className="w-6 h-6" />
        ) : (
          (userData?.photoURL || currentUser?.photoURL) ? (
            <img src={(userData?.photoURL || currentUser?.photoURL)} alt="Me" className="w-full h-full object-cover" />
          ) : (
            currentUser?.displayName?.charAt(0).toUpperCase() || 'U'
          )
        )}
      </div>
      
      {/* Composer Body */}
      <div className="flex-1 pt-2">
        <textarea 
          autoFocus={isModal}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder={
            activeType === 'poll' ? "Ask a question..." : 
            activeType === 'event' ? "Describe the event..." :
            activeType === 'market' ? "Provide details about the item..." :
            activeType === 'image' ? "Add a caption for your image..." :
            isGhostMode ? "Share an anonymous secret to campus..." : 
            "What's happening on campus?"
          }
          className={`w-full bg-transparent border-none outline-none resize-none font-medium transition-colors ${
            isModal ? 'text-lg min-h-[80px]' : 'text-base min-h-[60px]'
          } ${
            isGhostMode ? 'text-white placeholder-purple-300' : 'text-gray-900 placeholder-gray-400'
          }`}
        />

        {/* Dynamic Attachments */}
        {activeType === 'poll' && (
          <div className={getContainerClass()}>
            {renderHeader('Poll Options')}
            <div className="flex flex-col gap-2">
              {pollOptions.map((opt, idx) => (
                <input 
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => handlePollChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className={getInputClass()}
                />
              ))}
            </div>
            {pollOptions.length < 4 && (
              <button 
                onClick={handleAddPollOption}
                className={`mt-3 text-sm font-bold flex items-center gap-1 ${isGhostMode ? 'text-purple-300 hover:text-white' : 'text-blue-500 hover:text-blue-700'}`}
              >
                + Add Option
              </button>
            )}
          </div>
        )}

        {activeType === 'image' && (
          <div className={getContainerClass()}>
            {renderHeader('Upload Image')}
            
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isGhostMode 
                    ? 'border-purple-500/50 hover:bg-purple-900/40' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <UploadCloud className={`w-8 h-8 mb-2 ${isGhostMode ? 'text-purple-400' : 'text-gray-400'}`} />
                <p className={`text-sm font-bold ${isGhostMode ? 'text-purple-300' : 'text-gray-600'}`}>Click to upload an image</p>
                <p className={`text-xs mt-1 ${isGhostMode ? 'text-purple-400/70' : 'text-gray-400'}`}>PNG, JPG, GIF up to 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 mt-2">
                <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-64 object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(''); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input 
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
          </div>
        )}

        {activeType === 'event' && (
          <div className={getContainerClass()}>
             {renderHeader('Event Details')}
             <div className="flex flex-col gap-2">
               <input type="text" value={eventData.title} onChange={(e) => setEventData({...eventData, title: e.target.value})} placeholder="Event Title (e.g. Study Session)" className={getInputClass()} />
               <div className="flex gap-2">
                 <input type="date" value={eventData.date} onChange={(e) => setEventData({...eventData, date: e.target.value})} className={getInputClass()} />
                 <input type="time" value={eventData.time} onChange={(e) => setEventData({...eventData, time: e.target.value})} className={getInputClass()} />
               </div>
               <input type="text" value={eventData.location} onChange={(e) => setEventData({...eventData, location: e.target.value})} placeholder="Location (e.g. Library 3rd Floor)" className={getInputClass()} />
             </div>
          </div>
        )}

        {activeType === 'market' && (
          <div className={getContainerClass()}>
             {renderHeader('Marketplace Listing')}
             <div className="flex flex-col gap-2">
               <input type="text" value={marketData.title} onChange={(e) => setMarketData({...marketData, title: e.target.value})} placeholder="What are you selling? (e.g. Bio 101 Textbook)" className={getInputClass()} />
               <input type="number" min="0" step="0.01" value={marketData.price} onChange={(e) => setMarketData({...marketData, price: e.target.value})} placeholder="Price ($)" className={getInputClass()} />
               
               <div className={`mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                 isGhostMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'
               }`} onClick={() => fileInputRef.current?.click()}>
                 {imagePreview ? (
                   <div className="relative inline-block">
                     <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg" />
                     <button onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                   </div>
                 ) : (
                   <div className={`flex flex-col items-center gap-1 ${isGhostMode ? 'text-gray-400' : 'text-gray-500'}`}>
                     <UploadCloud className="w-6 h-6" />
                     <span className="text-sm font-medium">Add a photo of the item</span>
                   </div>
                 )}
               </div>
               <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
             </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className={`flex items-center justify-between pt-3 border-t mt-4 transition-colors flex-wrap gap-y-3 ${
          isGhostMode ? 'border-gray-800' : 'border-gray-100'
        }`}>
          <div className="flex gap-2">
            <button onClick={() => setActiveType(activeType === 'image' ? 'text' : 'image')} className={`p-2 rounded-full transition-colors ${activeType === 'image' ? (isGhostMode ? 'bg-purple-800 text-white' : 'bg-blue-100 text-blue-600') : (isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100')}`} title="Add Image">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveType(activeType === 'poll' ? 'text' : 'poll')} className={`p-2 rounded-full transition-colors ${activeType === 'poll' ? (isGhostMode ? 'bg-purple-800 text-white' : 'bg-blue-100 text-blue-600') : (isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100')}`} title="Create Poll">
              <BarChart2 className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveType(activeType === 'event' ? 'text' : 'event')} className={`p-2 rounded-full transition-colors ${activeType === 'event' ? (isGhostMode ? 'bg-purple-800 text-white' : 'bg-green-100 text-green-600') : (isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100')}`} title="Host Event">
              <Calendar className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveType(activeType === 'market' ? 'text' : 'market')} className={`p-2 rounded-full transition-colors ${activeType === 'market' ? (isGhostMode ? 'bg-purple-800 text-white' : 'bg-yellow-100 text-yellow-600') : (isGhostMode ? 'text-purple-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100')}`} title="Sell Item">
              <Tag className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={isPosting || (activeType === 'text' && !postText.trim())}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isGhostMode ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isGhostMode ? 'Post as Ghost' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposePost;
