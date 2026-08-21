import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    /* Full-width, Edge-to-Edge Layout */
    <div className="min-h-screen w-full bg-gray-50 flex font-sans text-gray-900">
      
      {/* Left Panel - Solid white, anchored to the left edge */}
      <div className="hidden md:block w-[260px] xl:w-[280px] shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 z-10">
        <Sidebar />
      </div>

      {/* Center Feed - Flexible width, scrolling content */}
      <main className="flex-1 min-h-screen flex justify-center py-8">
        <div className="w-full max-w-[680px] px-4 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Right Panel - Solid white, anchored to the right edge */}
      <aside className="hidden lg:block w-[320px] xl:w-[350px] shrink-0 bg-white border-l border-gray-200 h-screen sticky top-0 py-6 px-6 overflow-y-auto z-10">
        {/* Placeholder for Widgets (Trending, Events, Search) */}
        <div className="flex flex-col gap-8">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Trending on Campus</h3>
            <div className="space-y-3">
              <div className="cursor-pointer">
                <p className="text-xs text-gray-500 font-medium">Sports</p>
                <p className="text-sm font-bold text-gray-900">Homecoming Game</p>
              </div>
              <div className="cursor-pointer">
                <p className="text-xs text-gray-500 font-medium">Academics</p>
                <p className="text-sm font-bold text-gray-900">Finals Schedule Released</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
};

export default DashboardLayout;
