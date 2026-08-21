import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[var(--bg-base)] text-[var(--text-main)] font-sans">
      <div className="max-w-[1280px] mx-auto w-full flex px-4 sm:px-6 lg:px-8">
        
        {/* Left Sidebar Column */}
        <div className="hidden md:block w-[240px] shrink-0">
          <Sidebar />
        </div>

        {/* Center & Right Wrapper */}
        <div className="flex-1 flex justify-center gap-8 lg:gap-12 pl-0 md:pl-8">
          
          {/* Main Feed Column */}
          <main className="flex-1 max-w-[600px] w-full min-h-screen py-8">
            <Outlet />
          </main>

          {/* Right Widgets Column (Placeholder for Layout structure) */}
          <aside className="hidden lg:block w-[320px] shrink-0 h-screen sticky top-0 py-8 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col gap-6" id="right-widgets-container">
              {/* Widgets will be rendered here by the page component, or we can move them here globally later */}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
