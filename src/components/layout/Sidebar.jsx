import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageSquare, Bell, User, Settings, Ghost, Plus, Users } from 'lucide-react';
import { useGhost } from '../../context/GhostContext';

const Sidebar = ({ onOpenCompose }) => {
  const location = useLocation();
  const { isGhostMode, toggleGhostMode } = useGhost();

  const mainLinks = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Clubs', path: '/clubs', icon: Users },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const secondaryLinks = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="h-full flex flex-col py-6">
      {/* Brand */}
      <Link to="/home" className="px-8 mb-6 block hover:opacity-80 transition-opacity">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          CampusX
        </h1>
      </Link>

      {/* Top Ghost Mode Toggle */}
      <div className="px-4 mb-6">
        <button 
          onClick={toggleGhostMode}
          className={`w-full flex items-center justify-between border px-4 py-3 rounded-xl transition-all group ${
            isGhostMode 
              ? 'bg-purple-50 border-purple-100 hover:bg-purple-100' 
              : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg shadow-sm transition-all group-hover:scale-110 ${
              isGhostMode ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
            }`}>
              <Ghost className="w-4 h-4" />
            </div>
            <span className={`text-[14px] font-bold ${isGhostMode ? 'text-purple-900' : 'text-gray-900'}`}>
              Ghost Mode
            </span>
          </div>
          
          {/* Animated Toggle Switch */}
          <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ease-in-out ${
            isGhostMode ? 'bg-purple-600' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-300 ease-in-out ${
              isGhostMode ? 'left-[18px]' : 'left-[2px]'
            }`}></div>
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 mb-8 px-4">
        {mainLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-gray-100 font-bold text-black' : 'font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <link.icon className={`w-[22px] h-[22px] transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[15px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Primary Action Button */}
      <div className="px-6 mb-8">
        <button 
          onClick={onOpenCompose}
          className="w-full bg-black text-white flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5" /> Post
        </button>
      </div>

      {/* Secondary Navigation */}
      <nav className="flex flex-col gap-1 mt-auto px-4">
        {secondaryLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-gray-100 font-bold text-black' : 'font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <link.icon className={`w-[20px] h-[20px] transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[14px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
