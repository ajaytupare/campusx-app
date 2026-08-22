import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, runTransaction, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Star, Loader2, MessageSquare, MapPin, Trash2 } from 'lucide-react';

const DiscoverDetail = () => {
  const { type, id } = useParams(); // type is 'college' or 'teacher'
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [entityData, setEntityData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Entity Data
  useEffect(() => {
    if (!type || !id) return;
    
    // We expect collection to be 'colleges' or 'teachers'
    const colName = type === 'college' ? 'colleges' : 'teachers';
    
    const unsubscribe = onSnapshot(doc(db, colName, id), (docSnap) => {
      if (docSnap.exists()) {
        setEntityData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setEntityData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [type, id]);

  // Fetch Reviews
  useEffect(() => {
    if (!id) return;

    // We remove orderBy() from the query to avoid requiring a Firebase Composite Index.
    const q = query(
      collection(db, 'reviews'),
      where('targetId', '==', id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort client-side (newest first)
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });
      
      setReviews(fetched);
    });

    return () => unsubscribe();
  }, [id]);

  const handleDeleteEntity = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const colName = type === 'college' ? 'colleges' : 'teachers';
      await deleteDoc(doc(db, colName, id));
      navigate('/discover');
    } catch (error) {
      console.error("Error deleting entity:", error);
      alert("Failed to delete: " + error.message);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      const colName = type === 'college' ? 'colleges' : 'teachers';
      const entityRef = doc(db, colName, id);

      await runTransaction(db, async (transaction) => {
        const entityDoc = await transaction.get(entityRef);
        if (!entityDoc.exists()) throw new Error("Entity does not exist!");

        const currentData = entityDoc.data();
        const currentCount = currentData.reviewCount || 0;
        const currentAvg = currentData.rating || 0;

        // Calculate new moving average
        const newCount = currentCount + 1;
        const newAvg = ((currentAvg * currentCount) + reviewRating) / newCount;

        // Create new review doc
        const newReviewRef = doc(collection(db, 'reviews'));
        transaction.set(newReviewRef, {
          targetId: id,
          type: type,
          authorId: currentUser.uid,
          authorName: currentUser.displayName || 'Campus Student',
          rating: reviewRating,
          text: reviewText.trim(),
          createdAt: serverTimestamp()
        });

        // Update entity doc
        transaction.update(entityRef, {
          rating: newAvg,
          reviewCount: newCount
        });
      });

      setReviewText('');
      setReviewRating(5);
      setIsReviewing(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!entityData) {
    return (
      <div className="flex-1 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Not Found</h2>
        <p className="text-gray-500 mb-4">This {type} does not exist.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 font-medium hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen pb-12 animate-in fade-in">
      
      {/* Header / Nav */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 capitalize">{type} Details</h1>
        </div>
        
        {currentUser && entityData.creatorId === currentUser.uid && (
          <button 
            onClick={handleDeleteEntity}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2"
            title="Delete this entry"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hero Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="h-48 md:h-64 bg-gray-200 w-full relative">
          {entityData.image && (
            <img src={entityData.image} alt={entityData.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 w-full text-white">
            <h2 className="text-3xl font-extrabold mb-2">{entityData.name}</h2>
            <div className="flex items-center gap-4 text-sm font-medium opacity-90">
              {entityData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {entityData.location}
                </div>
              )}
              {entityData.subject && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {entityData.subject}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Rating Bar */}
        <div className="px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg font-bold">
              <Star className="w-4 h-4 fill-current" />
              {Number(entityData.rating || 0).toFixed(1)}
            </div>
            <span className="text-gray-500 font-medium text-sm">
              Based on {entityData.reviewCount || 0} reviews
            </span>
          </div>
          
          {!isReviewing && (
            <button 
              onClick={() => setIsReviewing(true)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* Review Form */}
      {isReviewing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Leave a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 transition-colors"
                  >
                    <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Thoughts</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y bg-gray-50 text-sm"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsReviewing(false)}
                className="px-5 py-2.5 rounded-full font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !reviewText.trim()}
                className="px-5 py-2.5 rounded-full font-bold text-sm bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900">Recent Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 font-bold">No reviews yet</p>
            <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => {
              const dateString = review.createdAt?.toDate 
                ? review.createdAt.toDate().toLocaleDateString()
                : 'Just now';

              return (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {review.authorName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{review.authorName}</p>
                        <p className="text-xs text-gray-500">{dateString}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-yellow-200">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {review.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{review.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default DiscoverDetail;
