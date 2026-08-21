import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    /* Full-width, edge-to-edge layout to eliminate empty side margins */
    <div className="min-h-screen w-full bg-[var(--bg-base)] text-[var(--text-main)] font-sans flex">
      
      {/* Left Panel - Anchored to the far left, solid white background */}
      <div className="hidden md:block w-[280px] shrink-0 bg-white border-r border-[var(--border-light)] h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <Sidebar />
      </div>

      {/* Center Main Feed - Expands to fill available space gracefully */}
      <main className="flex-1 min-h-screen flex justify-center py-8">
        {/* We keep a max-width on the feed itself so text doesn't span 2000px and become unreadable, 
            but the container expands to eat up empty space */}
        <div className="w-full max-w-[720px] px-4 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Right Panel - Anchored to the far right, solid white background */}
      <aside 
        className="hidden xl:block w-[380px] shrink-0 bg-white border-l border-[var(--border-light)] h-screen sticky top-0 pt-6 pb-6 overflow-y-auto hide-scrollbar shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10" 
        id="right-sidebar-slot"
      >
        {/* Right widgets will portal here */}
      </aside>

    </div>
  );
};

export default DashboardLayout;
