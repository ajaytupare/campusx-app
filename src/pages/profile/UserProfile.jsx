import { MapPin, Calendar, Link as LinkIcon, BookOpen, Users, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { currentUser } = useAuth();
  
  // Create a default handle from the email (e.g., alex.chen@university.edu -> @alex.chen)
  const defaultHandle = currentUser?.email ? currentUser.email.split('@')[0] : 'student';

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Cover Photo */}
        <div className="h-40 sm:h-48 w-full bg-gray-200 relative">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80" 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info Section */}
        <div className="px-5 sm:px-8 relative">
          
          {/* Avatar & Edit Button Row */}
          <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4 relative z-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm flex items-center justify-center text-3xl font-bold text-gray-500">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                // Fallback avatar if no photo
                currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <button className="bg-white border border-gray-300 text-gray-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm mb-2 sm:mb-4">
              Edit Profile
            </button>
          </div>

          {/* Bio & Details */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {currentUser?.displayName || 'Campus Student'}
            </h1>
            <p className="text-gray-500 font-medium text-sm mb-3">@{defaultHandle} &bull; Member</p>
            
            <p className="text-gray-800 text-sm leading-relaxed mb-4">
              Welcome to my CampusX profile! (Bio and classes sync coming soon to the backend). ☕️💻
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Seattle, WA</div>
              <div className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> <a href="#" className="text-blue-500 hover:underline">github.com/alexchen</a></div>
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined Aug 2021</div>
            </div>
          </div>

          {/* Campus Life (Classes & Clubs) */}
          <div className="border-t border-gray-100 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Current Classes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Current Classes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold">CS 401</span>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold">MATH 302</span>
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold">ENG 101</span>
              </div>
            </div>

            {/* Clubs & Orgs */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Clubs & Orgs</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-lg text-xs font-bold">Robotics Club</span>
                <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-lg text-xs font-bold">Hackathon Team</span>
              </div>
            </div>

          </div>

        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-gray-200 bg-gray-50/50">
          <button className="flex-1 py-4 text-sm font-bold text-gray-900 border-b-2 border-black hover:bg-gray-100 transition-colors">Posts</button>
          <button className="flex-1 py-4 text-sm font-bold text-gray-500 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-900 transition-colors">Replies</button>
          <button className="flex-1 py-4 text-sm font-bold text-gray-500 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-900 transition-colors">Saved</button>
        </div>

      </div>

      {/* User's Feed */}
      <div className="flex flex-col gap-5">
        
        {/* Post 1 */}
        <article className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[14px] sm:text-[15px] text-gray-900 leading-tight">Alex Chen</h4>
                <p className="text-[12px] sm:text-[13px] font-medium text-gray-500">Computer Science '25 &bull; 4h ago</p>
              </div>
            </div>
          </div>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-gray-900 mb-4">
            Just pushed the final commit for my CS 401 project. Time to sleep for 14 hours straight. 😴
          </p>
          <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-gray-100">
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-gray-500 hover:text-red-500 transition-colors">
              <Heart className="w-[18px] h-[18px]" /> 42
            </button>
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-gray-500 hover:text-[#1D9BF0] transition-colors">
              <MessageCircle className="w-[18px] h-[18px]" /> 8
            </button>
            <button className="flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <Share2 className="w-[18px] h-[18px]" />
            </button>
            <button className="ml-auto text-gray-500 hover:text-gray-900 transition-colors">
              <Bookmark className="w-[18px] h-[18px]" />
            </button>
          </div>
        </article>

      </div>
    </div>
  );
};

export default UserProfile;
