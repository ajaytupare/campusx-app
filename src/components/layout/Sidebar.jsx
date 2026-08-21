import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home, Compass, MessageSquare, Users, Ghost, GraduationCap, UsersRound, Calendar, Settings, BookOpen, Briefcase, Bell, User, Moon, Plus } from 'lucide-react';
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
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Friends', path: '/friends', icon: Users },
    { name: 'Colleges', path: '/colleges', icon: GraduationCap },
    { name: 'Ghost', path: '/ghost', icon: Ghost, isGhost: true },
    { name: 'Communities', path: '/communities', icon: UsersRound },
    { name: 'Events', path: '/events', icon: Calendar },
  ];

  return (
    <div className="w-[200px] h-screen flex flex-col py-8 pl-8 pr-4 overflow-y-auto hide-scrollbar shrink-0">
      
      {/* Brand */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[var(--cx-text-main)] tracking-tight leading-none">CampusX</h1>
        <p className="text-[12px] font-medium text-[var(--cx-text-muted)] mt-1">Student Hub</p>
      </div>

      {/* Create Post Button */}
      <Link 
        to="/home"
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--cx-primary)] text-white rounded-xl font-semibold text-[14px] mb-6 hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" /> Create Post
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative
                ${isActive 
                  ? 'font-bold text-[var(--cx-text-main)]' 
                  : 'font-medium text-[var(--cx-text-main)] hover:bg-black/[0.04]'}`}
            >
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--cx-text-main)] rounded-full"></div>
              )}
              <item.icon className={`w-[18px] h-[18px] ${item.isGhost && isGhostMode ? 'text-[var(--cx-ghost-start)]' : ''}`} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-4 space-y-1 pt-4 border-t border-[var(--cx-text-muted)]/15">
        <Link to="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-all duration-150">
          <Bell className="w-[18px] h-[18px]" />
          <span className="text-[15px]">Notifications</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-all duration-150">
          <Settings className="w-[18px] h-[18px]" />
          <span className="text-[15px]">Settings</span>
        </Link>
        <Link to="/profile/me" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-all duration-150">
          <User className="w-[18px] h-[18px]" />
          <span className="text-[15px]">Profile</span>
        </Link>
        
        {/* Dark Mode Toggle */}
        <button 
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-medium text-[var(--cx-text-main)] hover:bg-black/[0.04] transition-all duration-150"
        >
          <div className="flex items-center gap-3">
            <Moon className="w-[18px] h-[18px]" />
            <span className="text-[15px]">Dark Mode</span>
          </div>
          <div className="w-[38px] h-[22px] bg-[var(--cx-text-main)] rounded-full p-[2px] flex items-center">
            <div className="w-[18px] h-[18px] rounded-full bg-white transition-transform translate-x-0"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
