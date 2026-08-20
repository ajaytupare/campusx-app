import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex w-full min-h-screen bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] overflow-hidden font-sans antialiased">
      
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:block shrink-0 z-20">
        <Sidebar />
      </aside>

      {/* Main Content Area (Center + Right) */}
      <main className="flex-1 h-screen overflow-y-auto scroll-smooth focus:outline-none">
        {/* We use max-w-7xl to contain the center feed + right sidebar on very large screens with Apple HIG generous spacing */}
        <div className="w-full max-w-7xl mx-auto min-h-full p-6 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation would go here in later phases */}
    </div>
  );
};

export default DashboardLayout;
