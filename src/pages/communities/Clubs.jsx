import { useState } from 'react';
import { Search, Plus, Users, ChevronDown, X, ImagePlus, Check } from 'lucide-react';

const Clubs = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Dummy Data
  const clubs = [
    { 
      id: 1, 
      name: "Robotics Club", 
      category: "STEM", 
      members: 142, 
      description: "Building combat robots and autonomous drones. No experience required!", 
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80",
      logo: "https://images.unsplash.com/photo-1531297122539-d31b0a114dd8?auto=format&fit=crop&w=150&q=80"
    },
    { 
      id: 2, 
      name: "Debate Society", 
      category: "Academic", 
      members: 89, 
      description: "Weekly parliamentary debates on current events and philosophy.", 
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
      logo: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&w=150&q=80"
    },
    { 
      id: 3, 
      name: "Hiking & Outdoors", 
      category: "Social", 
      members: 320, 
      description: "Weekend excursions to the mountains. Gear rentals available.", 
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
      logo: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=150&q=80"
    },
    { 
      id: 4, 
      name: "Investment Group", 
      category: "Business", 
      members: 215, 
      description: "Managing a $50k student-run portfolio and networking.", 
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
      logo: "https://images.unsplash.com/photo-1579226905147-c0f2ee850c99?auto=format&fit=crop&w=150&q=80"
    },
    { 
      id: 5, 
      name: "Esports Team", 
      category: "Social", 
      members: 410, 
      description: "Varsity and casual teams for Valorant, LoL, and Smash.", 
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=150&q=80"
    },
    { 
      id: 6, 
      name: "Pre-Med Society", 
      category: "Academic", 
      members: 280, 
      description: "MCAT prep, volunteering opportunities, and guest speakers.", 
      image: "https://images.unsplash.com/photo-1584982751601-97d800904323?auto=format&fit=crop&w=600&q=80",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const categories = ['All', 'Academic', 'STEM', 'Social', 'Business', 'Sports', 'Arts'];

  // Filter Logic
  const filteredClubs = clubs.filter(club => {
    const matchesCategory = activeCategory === 'All' || club.category === activeCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col min-h-screen pb-12 relative">
      
      {/* Header & Create Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Campus Clubs</h1>
          <p className="text-gray-500 font-medium">Discover communities, join orgs, and find your people.</p>
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
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Results */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filteredClubs.map((club) => (
            <div key={club.id} className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Cover Image & Category Badge */}
              <div className="h-32 w-full bg-gray-100 relative">
                <img 
                  src={club.image} 
                  alt={club.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md">
                  {club.category}
                </div>
              </div>
              
              {/* Club Info */}
              <div className="px-5 pb-5 relative">
                
                {/* Logo Overlap */}
                <div className="w-16 h-16 rounded-xl bg-white border-4 border-white shadow-sm overflow-hidden -mt-8 mb-3 relative z-10">
                  <img src={club.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{club.name}</h3>
                
                <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold">{club.members} members</span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-5 min-h-[40px]">
                  {club.description}
                </p>
                
                <button className="w-full bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-900 hover:text-blue-700 py-2.5 rounded-xl font-bold text-sm transition-colors">
                  Join Club
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
          <p className="text-gray-500 font-medium">No clubs found matching your search.</p>
        </div>
      )}

      {/* Create Club Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-extrabold text-gray-900">Start a New Club</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              
              {/* Media Uploads */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Photo</label>
                  <div className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                    <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-500">Upload Banner</span>
                  </div>
                </div>
                <div className="w-24">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Logo</label>
                  <div className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Inputs */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Club Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Campus Debate Society" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all text-gray-900">
                    <option value="" disabled selected>Select a category...</option>
                    <option value="Academic">Academic</option>
                    <option value="STEM">STEM</option>
                    <option value="Social">Social</option>
                    <option value="Business">Business</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts">Arts</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  placeholder="What is your club about? Who should join?" 
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all resize-none"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-5 py-2.5 font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-2.5 font-bold text-sm shadow-sm transition-all active:scale-95">
                <Check className="w-4 h-4" /> Create Club
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Clubs;
