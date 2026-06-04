import { Link, NavLink, useNavigate } from 'react-router-dom';
import { RoleConfig } from '@/types/roles';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';
import { useData } from '@/context/DataContext';

interface SidebarProps {
  role: RoleConfig;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ role, open, onClose }: SidebarProps) {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

  const initials = currentUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`sidebar ${open ? 'sidebar-open' : ''}`}
      aria-label={`${role.name} navigation`}
    >
      <div className="sidebar-header">
        <div className={`sidebar-logo bg-gradient-to-br ${role.color}`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">CMS</p>
          <p className="truncate text-xs font-medium text-cyber-600">{role.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="sidebar-close"
          aria-label="Close menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Menu</p>
        <ul className="space-y-1">
          {role.navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === role.dashboardPath}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <DeveloperCredit variant="sidebar" />

      <div className="sidebar-footer">
        {currentUser && (
          <div className="sidebar-user">
            <div className={`sidebar-user-avatar bg-gradient-to-br ${role.color}`}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>
        )}
        <div className="mt-3 flex flex-col gap-2">
          <Link to="/login" onClick={onClose} className="sidebar-action">
            Home
          </Link>
          <button type="button" onClick={handleLogout} className="sidebar-action-primary">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
