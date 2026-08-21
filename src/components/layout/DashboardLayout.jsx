import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex w-full min-h-screen bg-[var(--cx-bg-base)] text-[var(--cx-text-main)] overflow-hidden">
      
      {/* Desktop Sidebar (Left) - no card wrapper, sits directly on bg */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto scroll-smooth">
        <div className="w-full max-w-7xl mx-auto h-full p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
