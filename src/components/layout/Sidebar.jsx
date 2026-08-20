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
    // In a real app we'd use Context. For this mock, we just load on mount.
    // We can also listen to a custom event if we want cross-component localstorage sync.
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
    <div className="w-[260px] h-[calc(100vh-48px)] bg-white/60 backdrop-blur-2xl rounded-[24px] shadow-sm border border-black/5 flex flex-col p-5 m-6 overflow-y-auto">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-9 h-9 bg-[var(--cx-primary)] rounded-[12px] flex items-center justify-center shrink-0">
          <span className="text-white font-extrabold text-lg">C</span>
        </div>
        <div>
          <h1 className="font-extrabold text-[20px] tracking-tight text-[var(--cx-text-main)] leading-none">CampusX</h1>
        </div>
      </div>

      {/* Global Ghost Toggle */}
      <button 
        onClick={toggleGhostMode}
        className={`flex items-center justify-between px-4 py-3 rounded-[16px] transition-all mb-4 border
          ${isGhostMode 
            ? 'bg-[var(--cx-ghost-start)] text-white shadow-md shadow-purple-500/20 border-transparent' 
            : 'bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] hover:bg-zinc-200 border-black/5/50'}`}
      >
        <div className="flex items-center gap-3 font-bold text-[14px]">
          <Ghost className="w-5 h-5" />
          {isGhostMode ? 'Ghost Mode ON' : 'Go Ghost'}
        </div>
        <div className={`w-8 h-5 rounded-full p-1 flex items-center transition-colors ${isGhostMode ? 'bg-white/30' : 'bg-zinc-300'}`}>
          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isGhostMode ? 'translate-x-3' : 'translate-x-0'}`}></div>
        </div>
      </button>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-3 py-3 rounded-[16px] transition-all group
                ${isActive ? 'bg-[var(--cx-bg-base)] text-[var(--cx-primary)]' : 'text-[var(--cx-text-muted)] hover:bg-[var(--cx-bg-base)] hover:text-[var(--cx-text-main)]'}`}
            >
              <div className="flex items-center gap-3.5">
                <item.icon className={`w-5 h-5 transition-colors ${item.isGhost && !isActive ? 'text-[var(--cx-ghost-start)]' : ''} ${isActive ? 'text-[var(--cx-primary)]' : ''}`} />
                <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-semibold'}`}>
                  {item.name}
                </span>
              </div>
              
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings Profile placeholder */}
      <div className="mt-8 pt-4 border-t border-black/5">
        <Link to="/profile/me" className="flex items-center gap-3 px-3 py-3 rounded-[16px] hover:bg-[var(--cx-bg-base)] transition-colors group mb-1">
          <div className="w-9 h-9 rounded-full bg-[var(--cx-bg-base)] shrink-0 overflow-hidden">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[var(--cx-text-main)] leading-tight">{profile.name}</span>
            <span className="text-[11px] font-medium text-[var(--cx-text-muted)]">View Profile</span>
          </div>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-3 rounded-[16px] hover:bg-[var(--cx-bg-base)] transition-colors group text-[var(--cx-text-muted)] hover:text-[var(--cx-text-main)]">
          <Settings className="w-5 h-5" />
          <span className="text-[14px] font-semibold">Settings</span>
        </Link>
      </div>

    </div>
  );
};

export default Sidebar;
