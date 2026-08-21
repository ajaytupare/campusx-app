import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { ArrowLeft, Star, GraduationCap, Send, BookKey, Hash } from 'lucide-react';

const TeacherProfile = () => {
  const { id } = useParams();
  const { userProfile, currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [courseCode, setCourseCode] = useState('');

  const fetchTeacherAndReviews = () => {
    const allTeachers = JSON.parse(localStorage.getItem('cx_mock_teachers') || '[]');
    const foundTeacher = allTeachers.find(t => t.id === id);
    setTeacher(foundTeacher);

    const allReviews = JSON.parse(localStorage.getItem('cx_mock_teacher_reviews') || '[]');
    const teacherReviews = allReviews.filter(r => r.teacherId === id);
    teacherReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setReviews(teacherReviews);
  };

  useEffect(() => {
    fetchTeacherAndReviews();
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const allReviews = JSON.parse(localStorage.getItem('cx_mock_teacher_reviews') || '[]');
    
    const newReview = {
      id: 'trev_' + Date.now(),
      teacherId: id,
      text: newReviewText.trim(),
      courseCode: courseCode.trim().toUpperCase() || 'General',
      rating: newReviewRating,
      createdAt: new Date().toISOString(),
      isGhost: isGhostMode,
      // PRIVACY ENFORCEMENT: Strip data if Ghost
      authorId: isGhostMode ? null : currentUser.uid,
      authorName: isGhostMode ? null : (userProfile?.name || 'Student'),
    };

    allReviews.push(newReview);
    localStorage.setItem('cx_mock_teacher_reviews', JSON.stringify(allReviews));
    
    setNewReviewText('');
    setCourseCode('');
    setNewReviewRating(5);
    fetchTeacherAndReviews();
  };

  if (!teacher) {
    return <div className="p-8 text-center text-[var(--cx-text-muted)]">Loading professor data...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto gap-6 pb-12">
      
      <Link to="/teachers" className="inline-flex items-center gap-2 text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-colors font-bold text-[14px] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      {/* Hero Profile */}
      <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500/20 to-[var(--cx-primary)]/20 opacity-50"></div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-end mt-12">
          <div className="w-24 h-24 rounded-2xl bg-[var(--cx-bg-base)] border-4 border-[var(--cx-bg-surface)] shadow-md flex items-center justify-center text-4xl font-bold text-[var(--cx-primary)] shrink-0">
            {teacher.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-3 leading-tight">
              {teacher.name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[var(--cx-text-muted)] text-[14px] font-semibold">
              <div className="flex items-center gap-2"><BookKey className="w-4 h-4" /> {teacher.department}</div>
              <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {teacher.college}</div>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg"><Star className="w-4 h-4 fill-amber-500" /> {teacher.rating.toFixed(1)} Avg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission */}
      <div className={`rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border transition-colors duration-300
        ${isGhostMode ? 'bg-[var(--cx-ghost-start)]/5 border-[var(--cx-ghost-start)]/20' : 'bg-[var(--cx-bg-surface)] border-black/[0.04]'}`}>
        <h3 className="font-semibold text-[16px] text-[var(--cx-text-main)] mb-4 flex items-center gap-2">
          {isGhostMode ? 'Leave an Anonymous Review' : 'Rate this Professor'}
        </h3>
        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[var(--cx-text-muted)]">Course:</span>
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--cx-text-muted)]" />
                <input 
                  type="text" 
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  placeholder="CS101"
                  className={`w-28 bg-[var(--cx-bg-base)] border border-transparent rounded-xl pl-8 pr-3 py-1.5 text-[14px] font-bold outline-none focus:ring-2 ${isGhostMode ? 'focus:ring-[var(--cx-ghost-start)]' : 'focus:ring-[var(--cx-primary)]'}`}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[var(--cx-text-muted)]">Rating:</span>
              <select 
                value={newReviewRating} 
                onChange={e => setNewReviewRating(Number(e.target.value))}
                className={`bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-3 py-1.5 text-[14px] font-bold outline-none focus:ring-2 ${isGhostMode ? 'focus:ring-[var(--cx-ghost-start)]' : 'focus:ring-[var(--cx-primary)]'}`}
              >
                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
          </div>
          
          <textarea 
            placeholder={isGhostMode ? "How was the class? Was it an easy A? Strict grader? (Your identity is totally hidden)" : "Share your experience with this professor..."}
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            className={`w-full bg-[var(--cx-bg-base)] border border-transparent rounded-xl px-4 py-3 text-[15px] outline-none resize-none min-h-[100px] font-medium transition-all focus:ring-2
              ${isGhostMode ? 'text-[var(--cx-text-main)] placeholder:text-[var(--cx-ghost-start)]/50 focus:ring-[var(--cx-ghost-start)]' : 'text-[var(--cx-text-main)] placeholder:text-[var(--cx-text-muted)]/50 focus:ring-[var(--cx-primary)]'}`}
          />
          
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={!newReviewText.trim()}
              className={`px-6 py-2.5 rounded-[14px] font-bold flex items-center gap-2 text-[14px] transition-transform active:scale-95
                ${!newReviewText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
                ${isGhostMode ? 'bg-[var(--cx-ghost-start)] text-white hover:shadow-purple-500/30' : 'bg-[var(--cx-primary)] text-white hover:shadow-indigo-500/30'}`}
            >
              Submit Review <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 mt-2">
        <h3 className="font-semibold text-[18px] text-[var(--cx-text-main)] mb-2 px-2">Course Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
            No reviews yet. Be the first to review {teacher.name}!
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-[var(--cx-bg-surface)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] relative overflow-hidden group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-black/[0.04]
                    ${review.isGhost ? 'bg-[var(--cx-text-main)] text-lg' : 'bg-[var(--cx-bg-base)]'}`}>
                    {review.isGhost ? '👻' : (
                      <span className="font-bold text-[var(--cx-primary)] text-sm">
                        {(review.authorName || 'S').charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[14px] text-[var(--cx-text-main)] flex items-center gap-2 leading-tight">
                      {review.isGhost ? `Ghost #${review.id.substring(5, 9).toUpperCase()}` : review.authorName}
                      {review.isGhost && (
                        <span className="bg-[var(--cx-ghost-start)]/10 text-[var(--cx-ghost-start)] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold">
                          Incognito
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] font-semibold text-[var(--cx-text-muted)]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-black/[0.04]">
                    {review.courseCode}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-zinc-200 text-[var(--cx-text-muted)]'}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-[14.5px] text-[var(--cx-text-main)] leading-relaxed font-medium whitespace-pre-wrap">
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default TeacherProfile;





