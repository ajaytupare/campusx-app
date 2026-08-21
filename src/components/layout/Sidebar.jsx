import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageSquare, Bell, User, Settings, Ghost, Plus } from 'lucide-react';
import { useGhost } from '../../context/GhostContext';

const Sidebar = () => {
  const location = useLocation();
  const { isGhostMode } = useGhost();

  const mainLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const secondaryLinks = [
    { name: 'Profile', path: '/profile/me', icon: User },
    { name: 'Ghost Mode', path: '/ghost', icon: Ghost, isGhost: true },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="h-screen py-8 pr-6 flex flex-col sticky top-0">
      {/* Brand */}
      <Link to="/" className="px-4 mb-8 block hover:opacity-80 transition-opacity">
        <h1 className="text-[28px] font-extrabold tracking-tight text-[var(--text-main)]">
          CampusX
        </h1>
      </Link>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 mb-8">
        {mainLinks.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'font-bold text-[var(--text-main)]' : 'font-medium text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--text-main)]'}`}
            >
              <link.icon className={`w-[22px] h-[22px] transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[16px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Primary Action Button */}
      <button className="w-full bg-[var(--accent-primary)] text-white flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-[15px] hover:bg-[var(--accent-hover)] transition-all shadow-sm active:scale-95 mb-8">
        <Plus className="w-5 h-5" /> Post
      </button>

      {/* Secondary Navigation */}
      <nav className="flex flex-col gap-1 mt-auto">
        {secondaryLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'font-bold text-[var(--text-main)]' : 'font-medium text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--text-main)]'}`}
            >
              <link.icon className={`w-[20px] h-[20px] transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'} ${link.isGhost && isGhostMode ? 'text-purple-500' : ''}`} />
              <span className="text-[15px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
