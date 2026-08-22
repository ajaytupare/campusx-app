import { useState, useEffect } from 'react';
import { Heart, MessageCircle, UserPlus, Ghost, Check, MoreHorizontal, Loader2, X, Calendar, Circle } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const qReqs = query(
      collection(db, 'follow_requests'),
      where('to', '==', currentUser.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeReqs = onSnapshot(qReqs, (snapshot) => {
      const fetchedReqs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(fetchedReqs);
      setLoading(false);
    });

    const qNotifs = query(
      collection(db, 'notifications'),
      where('toUserId', '==', currentUser.uid)
    );

    const unsubscribeNotifs = onSnapshot(qNotifs, (snapshot) => {
      let fetchedNotifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort in memory to avoid composite index requirement
      fetchedNotifs.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });

      setNotifications(fetchedNotifs);
    });

    return () => {
      unsubscribeReqs();
      unsubscribeNotifs();
    };
  }, [currentUser]);

  const handleAcceptRequest = async (requestId, fromUserId) => {
    if (!currentUser?.uid) return;
    try {
      // 1. Update the request status to accepted
      await updateDoc(doc(db, 'follow_requests', requestId), {
        status: 'accepted'
      });
      // 2. Add 'fromUserId' to current user's followers
      await updateDoc(doc(db, 'users', currentUser.uid), {
        followers: arrayUnion(fromUserId)
      });
      // 3. Add current user to 'fromUserId's following
      await updateDoc(doc(db, 'users', fromUserId), {
        following: arrayUnion(currentUser.uid)
      });
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      // We can just delete the request or mark it rejected
      await deleteDoc(doc(db, 'follow_requests', requestId));
    } catch (error) {
      console.error("Failed to deny request", error);
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 sm:pb-0">
      <div className="bg-white sm:rounded-2xl sm:border border-gray-200 overflow-hidden shadow-sm min-h-[calc(100vh-64px)] sm:min-h-0">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">Notifications</h2>
        </div>

        {/* Tabs */}
        <div className="flex px-2 border-b border-gray-200 bg-white">
          {['All', 'Requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-3.5 text-sm font-bold transition-all relative ${
                activeTab === tab 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'Requests' && requests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
              {tab === 'All' && notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100 bg-white">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : activeTab === 'Requests' ? (
            requests.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No pending requests</h3>
                <p className="text-gray-500 text-sm">When someone wants to follow you, it will appear here.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  
                  <Link to={`/profile/${req.from}`} className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shadow-sm border border-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                      {req.fromAvatar ? (
                        <img src={req.fromAvatar} alt={req.fromName} className="w-full h-full object-cover" />
                      ) : (
                        req.fromName?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <UserPlus className="w-3 h-3 text-white" />
                    </div>
                  </Link>
                  
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-900">
                        <Link to={`/profile/${req.from}`} className="font-bold hover:underline">
                          {req.fromName}
                        </Link>{' '}
                        requested to follow you.
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => handleAcceptRequest(req.id, req.from)}
                          className="px-4 py-1.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors active:scale-95"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => handleDenyRequest(req.id)}
                          className="px-4 py-1.5 bg-gray-100 text-gray-900 text-sm font-bold rounded-full hover:bg-gray-200 transition-colors active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))
            )
          ) : activeTab === 'All' ? (
            notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No notifications yet</h3>
                <p className="text-gray-500 text-sm">When people interact with your posts, you'll see it here.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => {
                    if (!notif.read) handleMarkAsRead(notif.id);
                  }}
                  className={`p-4 transition-colors flex items-start gap-4 cursor-pointer ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                >
                  <Link to={`/profile/${notif.fromUserId}`} className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shadow-sm border border-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                      {notif.isGhost ? (
                        <Ghost className="w-6 h-6 text-purple-600" />
                      ) : notif.fromUserAvatar ? (
                        <img src={notif.fromUserAvatar} alt={notif.fromUserName} className="w-full h-full object-cover" />
                      ) : (
                        notif.fromUserName?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${notif.type === 'like' ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {notif.type === 'like' ? <Heart className="w-3 h-3 text-white fill-current" /> : <Calendar className="w-3 h-3 text-white" />}
                    </div>
                  </Link>
                  
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-900">
                        <Link to={`/profile/${notif.fromUserId}`} className="font-bold hover:underline">
                          {notif.fromUserName}
                        </Link>{' '}
                        {notif.type === 'like' ? 'liked your post' : 'RSVPd to your event'}
                        {notif.postText && <span className="text-gray-500 line-clamp-1 break-all">"{notif.postText}"</span>}
                        {notif.postTitle && <span className="text-gray-500 line-clamp-1 break-all">Event: {notif.postTitle}</span>}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                    {!notif.read && <Circle className="w-2.5 h-2.5 fill-blue-500 text-blue-500 shrink-0" />}
                  </div>
                </div>
              ))
            )
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
