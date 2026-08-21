import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, Star, BookKey } from 'lucide-react';

const MOCK_TEACHERS = [
  { id: 't1', name: 'Dr. Alan Turing', department: 'Computer Science', college: 'Stanford University', rating: 4.9, reviewsCount: 142 },
  { id: 't2', name: 'Prof. Marie Curie', department: 'Chemistry', college: 'MIT', rating: 4.8, reviewsCount: 98 },
  { id: 't3', name: 'Dr. John Nash', department: 'Mathematics', college: 'Princeton University', rating: 4.2, reviewsCount: 204 },
  { id: 't4', name: 'Prof. Richard Feynman', department: 'Physics', college: 'Caltech', rating: 5.0, reviewsCount: 310 },
  { id: 't5', name: 'Dr. Ada Lovelace', department: 'Computer Science', college: 'University of Cambridge', rating: 4.7, reviewsCount: 88 }
];

const TeachersDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('cx_mock_teachers') || '[]');
    if (stored.length === 0) {
      stored = MOCK_TEACHERS;
      localStorage.setItem('cx_mock_teachers', JSON.stringify(stored));
    }
    setTeachers(stored);
  }, []);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto gap-6">
      
      {/* Header & Search */}
      <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] text-center">
        <div className="w-16 h-16 bg-[var(--cx-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--cx-primary)]">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2">Professor Directory</h1>
        <p className="text-[var(--cx-text-muted)] font-medium mb-8 max-w-xl mx-auto">
          Read anonymous course reviews, ratings, and survival guides from students who actually took the classes.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cx-text-muted)] w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by professor name, department, or college..." 
            className="w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl py-4 pl-12 pr-4 text-[15px] focus:bg-[var(--cx-bg-surface)] focus:border-[var(--cx-primary)]/30 outline-none transition-all text-[var(--cx-text-main)] font-bold placeholder:text-[var(--cx-text-muted)]/60 shadow-inner"
          />
        </div>
      </div>

      {/* Teacher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
        {filteredTeachers.map(teacher => (
          <Link 
            key={teacher.id} 
            to={`/teachers/${teacher.id}`}
            className="bg-[var(--cx-bg-surface)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-md hover:border-[var(--cx-primary)]/30 transition-all group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--cx-bg-base)] border border-black/[0.04] flex items-center justify-center text-2xl font-bold text-[var(--cx-primary)]">
                {teacher.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl text-[14px] font-bold text-amber-600 border border-amber-100">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {teacher.rating.toFixed(1)}
              </div>
            </div>
            
            <h3 className="text-[18px] font-semibold text-[var(--cx-text-main)] leading-tight mb-2 group-hover:text-[var(--cx-primary)] transition-colors">
              {teacher.name}
            </h3>
            
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-[var(--cx-text-muted)] text-[13px] font-semibold">
                <BookKey className="w-4 h-4" />
                {teacher.department}
              </div>
              <div className="flex items-center gap-2 text-[var(--cx-text-muted)] text-[13px] font-semibold">
                <GraduationCap className="w-4 h-4" />
                {teacher.college}
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-black/[0.04] text-[12px] font-bold text-[var(--cx-text-muted)]">
              Based on {teacher.reviewsCount} reviews
            </div>
          </Link>
        ))}
        {filteredTeachers.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
            No professors found matching "{searchQuery}"
          </div>
        )}
      </div>

    </div>
  );
};

export default TeachersDirectory;


