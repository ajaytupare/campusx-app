import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home, Compass, MessageSquare, Users, Ghost, GraduationCap, UsersRound, Calendar, Settings, BookOpen, Briefcase } from 'lucide-react';
import { useGhost } from '../../context/GhostContext';

const Sidebar = () => {
  const location = useLocation();
  const { isGhostMode, toggleGhostMode } = useGhost();
  const [profile, setProfile] = useState({ name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('cx_current_user_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Chat', path: '/chat', icon: MessageSquare, badge: '2' },
    { name: 'Friends', path: '/friends', icon: Users },
    { name: 'Colleges', path: '/colleges', icon: GraduationCap },
    { name: 'Teachers', path: '/teachers', icon: BookOpen },
    { name: 'Communities', path: '/communities', icon: UsersRound },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
  ];

  return (
    <div className="w-[260px] h-[calc(100vh-32px)] bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/[0.04] flex flex-col py-6 px-4 m-4 overflow-y-auto hide-scrollbar">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-7">
        <div className="w-8 h-8 bg-[#0071E3] rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-[15px]">C</span>
        </div>
        <h1 className="font-semibold text-[19px] tracking-tight text-[#1D1D1F] leading-none">CampusX</h1>
      </div>

      {/* Global Ghost Toggle */}
      <button 
        onClick={toggleGhostMode}
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 mb-5 border
          ${isGhostMode 
            ? 'bg-[#5E5CE6] text-white shadow-md shadow-[#5E5CE6]/20 border-transparent' 
            : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-black/[0.06] border-transparent'}`}
      >
        <div className="flex items-center gap-2.5 font-medium text-[14px]">
          <Ghost className="w-[18px] h-[18px]" />
          {isGhostMode ? 'Ghost Mode ON' : 'Go Ghost'}
        </div>
        <div className={`w-[34px] h-[20px] rounded-full p-[2px] flex items-center transition-colors duration-200 ${isGhostMode ? 'bg-white/30' : 'bg-black/10'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isGhostMode ? 'translate-x-[14px]' : 'translate-x-0'}`}></div>
        </div>
      </button>

      {/* Navigation List */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-black/[0.06] text-[#1D1D1F]' : 'text-[#86868B] hover:bg-black/[0.04] hover:text-[#1D1D1F]'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-[19px] h-[19px] transition-colors duration-200 ${isActive ? 'text-[#0071E3]' : ''}`} />
                <span className={`text-[14px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </div>
              
              {item.badge && (
                <span className="bg-[#FF3B30] text-white text-[11px] font-semibold min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Settings */}
      <div className="mt-6 pt-4 border-t border-black/[0.04]">
        <Link to="/profile/me" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.04] transition-all duration-200 group mb-0.5">
          <div className="w-8 h-8 rounded-full bg-[#F5F5F7] shrink-0 overflow-hidden">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#1D1D1F] leading-tight">{profile.name}</span>
            <span className="text-[11px] font-medium text-[#86868B]">View Profile</span>
          </div>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.04] transition-all duration-200 group text-[#86868B] hover:text-[#1D1D1F]">
          <Settings className="w-[19px] h-[19px]" />
          <span className="text-[14px] font-medium">Settings</span>
        </Link>
      </div>

    </div>
  );
};

export default Sidebar;
