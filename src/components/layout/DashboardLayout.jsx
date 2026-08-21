import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[var(--bg-base)] text-[var(--text-main)] font-sans flex justify-center">
      {/* 
        Twitter/Facebook style tight layout: 
        Sidebar (260px) + Feed (600px) + Widgets (320px) + Gaps (32px * 2) = ~1244px Max Width
      */}
      <div className="w-full max-w-[1244px] flex justify-between px-4 sm:px-6">
        
        {/* Left Sidebar Column - Fixed Width */}
        <div className="hidden md:block w-[260px] shrink-0">
          <Sidebar />
        </div>

        {/* Center Main Feed - Fills available space up to 600px */}
        <main className="flex-1 max-w-[600px] w-full min-h-screen py-6 px-0 sm:px-4 lg:px-8 border-x border-[var(--border-light)] bg-white/30">
          <Outlet />
        </main>

        {/* Right Widgets Column - Fixed Width */}
        <aside className="hidden lg:block w-[320px] shrink-0 h-screen sticky top-0 py-6 overflow-y-auto hide-scrollbar" id="right-sidebar-slot">
          {/* Widgets rendered by child pages will portal here, or we render them directly in the page */}
        </aside>

      </div>
    </div>
  );
};

export default DashboardLayout;
