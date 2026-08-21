import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGhost } from '../../context/GhostContext';
import { ArrowLeft, Star, MapPin, Users, Send } from 'lucide-react';

const CollegeProfile = () => {
  const { id } = useParams();
  const { userProfile, currentUser } = useAuth();
  const { isGhostMode } = useGhost();
  
  const [college, setCollege] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const fetchCollegeAndReviews = () => {
    const allColleges = JSON.parse(localStorage.getItem('cx_mock_colleges') || '[]');
    const foundCollege = allColleges.find(c => c.id === id);
    setCollege(foundCollege);

    const allReviews = JSON.parse(localStorage.getItem('cx_mock_college_reviews') || '[]');
    const collegeReviews = allReviews.filter(r => r.collegeId === id);
    // Sort descending by date
    collegeReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setReviews(collegeReviews);
  };

  useEffect(() => {
    fetchCollegeAndReviews();
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const allReviews = JSON.parse(localStorage.getItem('cx_mock_college_reviews') || '[]');
    
    const newReview = {
      id: 'rev_' + Date.now(),
      collegeId: id,
      text: newReviewText.trim(),
      rating: newReviewRating,
      createdAt: new Date().toISOString(),
      isGhost: isGhostMode,
      // PRIVACY ENFORCEMENT: Strip data if Ghost
      authorId: isGhostMode ? null : currentUser.uid,
      authorName: isGhostMode ? null : (userProfile?.name || 'Student'),
    };

    allReviews.push(newReview);
    localStorage.setItem('cx_mock_college_reviews', JSON.stringify(allReviews));
    
    setNewReviewText('');
    setNewReviewRating(5);
    fetchCollegeAndReviews();
  };

  if (!college) {
    return <div className="p-8 text-center text-[var(--cx-text-muted)]">Loading college data...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto gap-6 pb-12">
      
      <Link to="/colleges" className="inline-flex items-center gap-2 text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)] transition-colors font-bold text-[14px] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      {/* Hero Profile */}
      <div className="bg-[var(--cx-bg-surface)] rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[var(--cx-primary)]/20 to-purple-500/20 opacity-50"></div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-end mt-12">
          <div className="w-24 h-24 rounded-[20px] bg-white border-4 border-[var(--cx-bg-surface)] shadow-md flex items-center justify-center text-4xl font-bold text-[var(--cx-primary)] shrink-0">
            {college.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[var(--cx-text-main)] tracking-tight mb-2 leading-tight">
              {college.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[var(--cx-text-muted)] text-[14px] font-semibold">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {college.location}</div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {college.students.toLocaleString()} Students</div>
              <div className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-4 h-4 fill-amber-500" /> {college.rating.toFixed(1)} Avg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission */}
      <div className={`rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border transition-colors duration-300
        ${isGhostMode ? 'bg-[var(--cx-ghost-start)]/5 border-[var(--cx-ghost-start)]/20' : 'bg-[var(--cx-bg-surface)] border-black/[0.04]'}`}>
        <h3 className="font-semibold text-[16px] text-[var(--cx-text-main)] mb-4">
          {isGhostMode ? 'Leave an Anonymous Review' : 'Rate this College'}
        </h3>
        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
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
          
          <textarea 
            placeholder={isGhostMode ? "What is this college really like? Your identity is completely hidden." : "Share your experience at this college..."}
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
        <h3 className="font-semibold text-[18px] text-[var(--cx-text-main)] mb-2 px-2">Student Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-[var(--cx-text-muted)] font-medium bg-[var(--cx-bg-surface)] rounded-2xl border border-black/[0.04]">
            No reviews yet. Be the first to review {college.name}!
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-[var(--cx-bg-surface)] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-black/[0.04]
                    ${review.isGhost ? 'bg-zinc-900 text-lg' : 'bg-[var(--cx-bg-base)]'}`}>
                    {review.isGhost ? '👻' : (
                      <span className="font-bold text-[var(--cx-primary)] text-sm">
                        {(review.authorName || 'S').charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[14px] text-[var(--cx-text-main)] flex items-center gap-2 leading-tight">
                      {review.isGhost ? `Ghost #${review.id.substring(4, 8).toUpperCase()}` : review.authorName}
                      {review.isGhost && (
                        <span className="bg-[var(--cx-ghost-start)]/10 text-[var(--cx-ghost-start)] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold">
                          Incognito
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({length: 5}).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-zinc-200 text-zinc-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[var(--cx-text-muted)]">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[14px] text-[var(--cx-text-main)] leading-relaxed font-medium mt-3 whitespace-pre-wrap">
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default CollegeProfile;


