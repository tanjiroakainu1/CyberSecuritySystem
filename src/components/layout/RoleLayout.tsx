import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RoleConfig } from '@/types/roles';
import { useBodyTheme } from '@/hooks/useBodyTheme';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';

interface RoleLayoutProps {
  role: RoleConfig;
}

export function RoleLayout({ role }: RoleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  useBodyTheme('app');

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = '';
      return;
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setSidebarOpen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell app-bg">
      <Sidebar role={role} open={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay md:hidden"
          onClick={closeSidebar}
          aria-label="Close menu overlay"
        />
      )}

      <div className="app-main">
        <Header role={role} onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="app-content flex flex-col">
          <Outlet />
          <DeveloperCredit variant="strip" />
        </main>
      </div>
    </div>
  );
}
