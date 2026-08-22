import { useState, useEffect } from 'react';
import { Ghost, Calendar, BarChart2, MoreHorizontal, Loader2, Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import { useGhost } from '../context/GhostContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import ComposePost from '../components/feed/ComposePost';

const Dashboard = () => {
  const { isGhostMode } = useGhost();
  const { currentUser } = useAuth();
  const [activeFeedTab, setActiveFeedTab] = useState('Campus');
  
  // Feed State
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Comments State
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Fetch Posts in Real-Time
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId, likedBy = []) => {
    if (!currentUser) return;
    const isLiked = likedBy.includes(currentUser.uid);
    const postRef = doc(db, 'posts', postId);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(currentUser.uid),
          likes: increment(-1)
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(currentUser.uid),
          likes: increment(1)
        });
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleRSVP = async (post) => {
    if (!currentUser) return;
    
    const attendees = post.attendees || [];
    const hasRSVPd = attendees.some(a => a.uid === currentUser.uid);
    const postRef = doc(db, 'posts', post.id);

    try {
      if (hasRSVPd) {
        const updatedAttendees = attendees.filter(a => a.uid !== currentUser.uid);
        await updateDoc(postRef, { attendees: updatedAttendees });
      } else {
        await updateDoc(postRef, {
          attendees: arrayUnion({
            uid: currentUser.uid,
            name: isGhostMode ? 'Ghost' : (currentUser.displayName || 'Campus Student'),
            avatar: isGhostMode ? null : (currentUser.photoURL || null),
            isGhost: isGhostMode,
            rsvpAt: new Date().toISOString()
          })
        });
      }
    } catch (err) {
      console.error("Error updating RSVP:", err);
    }
  };

  const handleVote = async (post, optionIndex) => {
    if (!currentUser) return;
    
    const votedUsers = post.votedUsers || [];
    if (votedUsers.includes(currentUser.uid)) {
      return; // Already voted
    }

    const newTotalVotes = (post.totalVotes || 0) + 1;
    const newPollData = post.pollData.map((item, idx) => {
      let newVotes = item.votes || 0;
      if (idx === optionIndex) {
        newVotes += 1;
      }
      return {
        ...item,
        votes: newVotes,
        percent: Math.round((newVotes / newTotalVotes) * 100)
      };
    });

    const postRef = doc(db, 'posts', post.id);
    try {
      await updateDoc(postRef, {
        pollData: newPollData,
        totalVotes: newTotalVotes,
        votedUsers: arrayUnion(currentUser.uid)
      });
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!currentUser || !commentText.trim()) return;
    
    const postRef = doc(db, 'posts', postId);
    try {
      await updateDoc(postRef, {
        commentsArray: arrayUnion({
          id: Date.now().toString(),
          text: commentText.trim(),
          authorName: isGhostMode ? 'Ghost' : (currentUser.displayName || 'Campus Student'),
          authorAvatar: isGhostMode ? null : (currentUser.photoURL || null),
          createdAt: new Date().toISOString(),
          isGhost: isGhostMode
        }),
        comments: increment(1)
      });
      setCommentText('');
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Post Composer - Dynamically reacts to Ghost Mode */}
      <div className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all duration-300 ${
        isGhostMode 
          ? 'bg-gray-900 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
          : 'bg-white border-gray-200'
      }`}>
        <ComposePost />
      </div>

      {/* Feed Filter Tabs */}
      <div className="flex gap-6 border-b border-gray-200 px-2 sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 pt-2">
        {['Campus', 'Following', 'Clubs'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveFeedTab(tab)}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeFeedTab === tab ? 'text-black' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
            {activeFeedTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-5">
        {loadingPosts ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 text-sm">Be the first to share something on campus!</p>
          </div>
        ) : (
          posts.map((post) => (
            <article 
              key={post.id} 
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                post.type === 'ghost' ? 'border-purple-200' : 'border-gray-200'
              }`}
            >
              
              {/* Ghost Mode Header Ribbon */}
              {post.type === 'ghost' && (
                <div className="bg-purple-50 px-5 py-2 border-b border-purple-100 flex items-center gap-2">
                  <Ghost className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-900 tracking-wide uppercase">Anonymous Post</span>
                </div>
              )}

              <div className="p-5">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg ${
                      post.type === 'ghost' ? 'bg-purple-100' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {post.type === 'ghost' ? (
                        <Ghost className="w-5 h-5 text-purple-500" />
                      ) : (
                        post.authorAvatar ? (
                          <img src={post.authorAvatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          post.authorName?.charAt(0).toUpperCase() || 'U'
                        )
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${post.type === 'ghost' ? 'text-purple-900' : 'text-gray-900'}`}>
                        {post.authorName}
                      </h4>
                      <p className="text-xs font-medium text-gray-500">
                        {post.type === 'ghost' ? 'Anonymous nearby' : 'Student'} &bull;{' '}
                        {post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Post Content */}
                <p className="text-[15px] leading-relaxed text-gray-800 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Image Post Type */}
                {post.type === 'image' && post.postImage && (
                  <div className="rounded-xl overflow-hidden border border-gray-100 mb-4 bg-gray-50 max-h-[400px]">
                    <img src={post.postImage} alt="Post Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Poll Post Type */}
                {post.type === 'poll' && post.pollData && (
                  <div className="flex flex-col gap-3 mb-4">
                    {post.pollData.map((pollItem, idx) => {
                      const hasVoted = post.votedUsers?.includes(currentUser?.uid);
                      return (
                        <div 
                          key={idx} 
                          onClick={() => handleVote(post, idx)}
                          className={`relative h-10 rounded-lg overflow-hidden flex items-center px-4 transition-colors ${
                            hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'
                          } ${
                            post.isGhost ? 'bg-purple-900/40 border border-purple-500/30 hover:bg-purple-900/60' : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div 
                            className={`absolute left-0 top-0 bottom-0 z-0 transition-all duration-500 ${
                              post.isGhost ? 'bg-purple-500/30' : 'bg-blue-100/50'
                            }`} 
                            style={{ width: hasVoted ? `${pollItem.percent}%` : '0%' }}
                          ></div>
                          <div className={`relative z-10 w-full flex justify-between text-sm font-bold ${
                            post.isGhost ? 'text-purple-100' : 'text-gray-800'
                          }`}>
                            <span>{pollItem.option}</span>
                            {hasVoted && <span>{pollItem.percent}%</span>}
                          </div>
                        </div>
                      );
                    })}
                    <div className={`text-xs font-medium flex items-center gap-1 mt-1 ${post.isGhost ? 'text-purple-400/60' : 'text-gray-500'}`}>
                      <BarChart2 className="w-3.5 h-3.5" /> {post.totalVotes || 0} votes
                    </div>
                  </div>
                )}

                {/* Event Post Type */}
                {post.type === 'event' && post.eventData && (() => {
                  const hasRSVPd = post.attendees?.some(a => a.uid === currentUser?.uid);
                  const isHost = post.authorId === currentUser?.uid;
                  
                  return (
                    <div className={`rounded-xl overflow-hidden border mb-4 p-4 ${post.isGhost ? 'bg-purple-900/20 border-purple-500/30' : 'bg-blue-50 border-blue-100'}`}>
                      <h3 className={`font-bold text-lg mb-2 ${post.isGhost ? 'text-purple-100' : 'text-blue-900'}`}>{post.eventData.title}</h3>
                      <div className={`flex flex-col gap-2 text-sm font-medium mb-4 ${post.isGhost ? 'text-purple-300' : 'text-blue-800'}`}>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {post.eventData.date} @ {post.eventData.time}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {post.eventData.location}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleRSVP(post)}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors ${
                          hasRSVPd 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : (post.isGhost ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                        }`}
                      >
                        {hasRSVPd ? '✅ You\'re going!' : 'Count me in'}
                      </button>

                      {/* Attendee List (Host Only) */}
                      {isHost && post.attendees && post.attendees.length > 0 && (
                        <div className={`mt-4 pt-3 border-t ${post.isGhost ? 'border-purple-500/30' : 'border-blue-200'}`}>
                          <p className={`text-xs font-bold mb-2 ${post.isGhost ? 'text-purple-300' : 'text-blue-900'}`}>
                            People Attending ({post.attendees.length})
                          </p>
                          <div className="flex flex-col gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                            {post.attendees.map(attendee => (
                              <div key={attendee.uid} className={`flex items-center gap-2 p-1.5 rounded-md ${post.isGhost ? 'bg-purple-900/40' : 'bg-white/60'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${attendee.isGhost ? 'bg-purple-900 text-purple-400' : 'bg-gray-200'}`}>
                                  {attendee.isGhost ? (
                                    <Ghost className="w-3.5 h-3.5" />
                                  ) : (
                                    attendee.avatar ? <img src={attendee.avatar} className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-gray-500">{attendee.name?.charAt(0)}</span>
                                  )}
                                </div>
                                <span className={`text-xs font-semibold truncate ${attendee.isGhost ? 'text-purple-200' : 'text-gray-800'}`}>
                                  {attendee.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Market Post Type */}
                {post.type === 'market' && post.marketData && (
                  <div className={`rounded-xl overflow-hidden border mb-4 p-4 flex justify-between items-center ${post.isGhost ? 'bg-purple-900/20 border-purple-500/30' : 'bg-green-50 border-green-100'}`}>
                    <div className="flex items-center gap-4">
                      {post.marketData.image && (
                        <img src={post.marketData.image} alt={post.marketData.title} className="w-16 h-16 rounded-lg object-cover border border-green-200 shadow-sm shrink-0" />
                      )}
                      <div>
                        <h3 className={`font-bold text-lg leading-tight ${post.isGhost ? 'text-purple-100' : 'text-green-900'}`}>{post.marketData.title}</h3>
                        <p className={`font-extrabold text-xl mt-1 ${post.isGhost ? 'text-purple-300' : 'text-green-700'}`}>${post.marketData.price}</p>
                      </div>
                    </div>
                    <button className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shrink-0 ${
                      post.isGhost ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}>
                      Message Seller
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => handleLike(post.id, post.likedBy || [])}
                    className={`flex items-center gap-2 text-sm font-semibold transition-colors group ${
                      post.likedBy?.includes(currentUser?.uid) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-[18px] h-[18px] group-active:scale-125 transition-transform" /> {post.likes || 0}
                  </button>
                  <button 
                    onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-500 transition-colors group"
                  >
                    <MessageCircle className="w-[18px] h-[18px] group-active:scale-125 transition-transform" /> {post.comments || 0}
                  </button>
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-500 transition-colors ml-auto group">
                    <Share2 className="w-[18px] h-[18px] group-active:scale-125 transition-transform" />
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                    {post.commentsArray?.map((comment) => (
                      <div key={comment.id} className="text-sm bg-gray-50 p-3 rounded-lg">
                        <span className="font-bold text-gray-900 block">{comment.authorName}</span>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                      />
                      <button 
                        onClick={() => handleCommentSubmit(post.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>

    </div>
  );
};

export default Dashboard;
