import { useState } from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const Discover = () => {
  const [activeTab, setActiveTab] = useState('colleges');

  // Dummy Data
  const colleges = [
    { name: "University of Washington", location: "Seattle, WA", rating: 4.8, reviews: 1240, image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=500&q=80" },
    { name: "Stanford University", location: "Stanford, CA", rating: 4.9, reviews: 3100, image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=500&q=80" },
    { name: "New York University", location: "New York, NY", rating: 4.6, reviews: 2890, image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=500&q=80" },
    { name: "University of Michigan", location: "Ann Arbor, MI", rating: 4.7, reviews: 1850, image: "https://images.unsplash.com/photo-1531331432470-3d843ff7cb62?auto=format&fit=crop&w=500&q=80" },
    { name: "Boston University", location: "Boston, MA", rating: 4.5, reviews: 1420, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80" },
    { name: "UCLA", location: "Los Angeles, CA", rating: 4.8, reviews: 2600, image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80" }
  ];

  const teachers = [
    { name: "Dr. Alan Turing", subject: "Computer Science", location: "Stanford, CA", rating: 4.9, reviews: 420, image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=500&q=80" },
    { name: "Prof. Sarah Connor", subject: "Engineering", location: "Los Angeles, CA", rating: 4.2, reviews: 180, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80" },
    { name: "Dr. Marie Curie", subject: "Chemistry", location: "New York, NY", rating: 5.0, reviews: 890, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80" },
    { name: "Prof. John Keating", subject: "Literature", location: "Boston, MA", rating: 4.8, reviews: 650, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80" },
  ];

  const items = activeTab === 'colleges' ? colleges : teachers;

  return (
    <div className="w-full flex flex-col min-h-screen pb-12">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pt-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Discover</h1>
          <p className="text-gray-500 font-medium">Find and rate the best campuses and professors.</p>
        </div>

        {/* Custom Segmented Control */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
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
      </div>

      {/* Airbnb-style Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 flex flex-col md:flex-row items-center gap-2 mb-10">
        
        <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full border-b md:border-b-0 md:border-r border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Search</span>
            <input type="text" placeholder={activeTab === 'colleges' ? "University name..." : "Professor name..."} className="w-full text-sm outline-none placeholder-gray-400 bg-transparent" />
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full border-b md:border-b-0 md:border-r border-gray-100">
          <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Area</span>
            <input type="text" placeholder="City, State, or Zip" className="w-full text-sm outline-none placeholder-gray-400 bg-transparent" />
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 px-6 py-4 md:py-0 h-full rounded-xl font-bold text-sm transition-colors w-full md:w-auto">
          <Filter className="w-4 h-4" /> Filters
        </button>
        
        <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 h-full rounded-xl font-bold text-sm transition-colors w-full md:w-auto">
          Search
        </button>

      </div>

      {/* Grid Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {items.map((item, idx) => (
          <div key={idx} className="group cursor-pointer flex flex-col">
            {/* Image Thumbnail */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl mb-4 bg-gray-100 relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
              />
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                <Star className="w-4 h-4 text-gray-900" />
              </button>
            </div>
            
            {/* Meta */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-bold text-base text-gray-900 leading-tight mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500">{activeTab === 'teachers' ? item.subject : item.location}</p>
                {activeTab === 'teachers' && <p className="text-xs text-gray-400 mt-0.5">{item.location}</p>}
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg shrink-0">
                <Star className="w-3.5 h-3.5 fill-black text-black" />
                <span className="text-sm font-bold text-gray-900">{item.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Discover;
