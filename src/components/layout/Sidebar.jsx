import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageSquare, Bell, User, Settings, Ghost, Plus } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const mainLinks = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const secondaryLinks = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Ghost Mode', path: '/ghost', icon: Ghost },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="h-full flex flex-col py-6">
      {/* Brand */}
      <Link to="/home" className="px-8 mb-8 block hover:opacity-80 transition-opacity">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          CampusX
        </h1>
      </Link>

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
        <button className="w-full bg-black text-white flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-md active:scale-95">
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
