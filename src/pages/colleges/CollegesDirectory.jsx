import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, MapPin, Users, Star } from 'lucide-react';

const MOCK_COLLEGES = [
  { id: 'c1', name: 'Stanford University', location: 'Stanford, CA', students: 16937, rating: 4.8 },
  { id: 'c2', name: 'Massachusetts Institute of Technology', location: 'Cambridge, MA', students: 11934, rating: 4.9 },
  { id: 'c3', name: 'University of California, Berkeley', location: 'Berkeley, CA', students: 45057, rating: 4.5 },
  { id: 'c4', name: 'New York University', location: 'New York, NY', students: 53265, rating: 4.3 },
  { id: 'c5', name: 'University of Michigan', location: 'Ann Arbor, MI', students: 50278, rating: 4.6 }
];

const CollegesDirectory = () => {
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('cx_mock_colleges') || '[]');
    if (stored.length === 0) {
      stored = MOCK_COLLEGES;
      localStorage.setItem('cx_mock_colleges', JSON.stringify(stored));
    }
    setColleges(stored);
  }, []);

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto gap-6">
      
      {/* Header & Search */}
      <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] text-center">
        <div className="w-16 h-16 bg-[var(--cx-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--cx-primary)]">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2">College Directory</h1>
        <p className="text-[var(--cx-text-muted)] font-medium mb-8 max-w-xl mx-auto">
          Explore universities, read raw anonymous reviews from real students, and find out what campus life is actually like.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by college name or location..." 
            className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl py-4 pl-12 pr-4 text-[15px] focus:bg-[var(--cx-bg-surface)] focus:border-[var(--cx-primary)]/30 outline-none transition-all text-[var(--cx-text-main)] font-bold placeholder:text-[var(--cx-text-muted)]/60 shadow-inner"
          />
        </div>
      </div>

      {/* College Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
        {filteredColleges.map(college => (
          <Link 
            key={college.id} 
            to={`/colleges/${college.id}`}
            className="bg-[var(--cx-bg-surface)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-md hover:border-[var(--cx-primary)]/30 transition-all group flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--cx-bg-base)] border border-black/[0.04] flex items-center justify-center mb-4 text-xl font-bold text-[var(--cx-primary)]">
              {college.name.charAt(0)}
            </div>
            
            <h3 className="text-[18px] font-semibold text-[var(--cx-text-main)] leading-tight mb-2 group-hover:text-[var(--cx-primary)] transition-colors">
              {college.name}
            </h3>
            
            <div className="flex items-center gap-2 text-[var(--cx-text-muted)] text-[13px] font-semibold mb-4">
              <MapPin className="w-4 h-4" />
              {college.location}
            </div>
            
            <div className="mt-auto pt-4 border-t border-black/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--cx-text-muted)]">
                <Users className="w-4 h-4" />
                {(college.students / 1000).toFixed(1)}k
              </div>
              <div className="flex items-center gap-1 text-[14px] font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                {college.rating.toFixed(1)}
              </div>
            </div>
          </Link>
        ))}
        {filteredColleges.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
            No colleges found matching "{searchQuery}"
          </div>
        )}
      </div>

    </div>
  );
};

export default CollegesDirectory;



