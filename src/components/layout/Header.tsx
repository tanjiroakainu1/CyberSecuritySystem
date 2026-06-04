import { Link, useNavigate } from 'react-router-dom';
import { RoleConfig } from '@/types/roles';
import { useData } from '@/context/DataContext';

interface HeaderProps {
  role: RoleConfig;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function Header({ role, onMenuToggle, sidebarOpen }: HeaderProps) {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

  const initials = currentUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header-glass sticky top-0 z-30">
      <div className="header-inner">
        <div className="flex min-w-0 flex-1 items-center gap-2 min-[480px]:gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="menu-toggle"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <div className="flex min-w-0 items-center gap-2 min-[480px]:gap-3">
            <div
              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br min-[480px]:flex sm:h-10 sm:w-10 ${role.color} text-white shadow-sm`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base lg:text-lg">
                <span className="header-title-short">CMS</span>
                <span className="header-title-full">Cybersecurity Management System</span>
              </h1>
              <p className="truncate text-xs font-medium text-cyber-600">{role.name}</p>
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="header-actions">
            <div className="user-pill">
              <div className={`user-avatar bg-gradient-to-br ${role.color}`}>{initials}</div>
              <div className="hidden text-right min-[480px]:block">
                <p className="max-w-[100px] truncate text-sm font-semibold text-slate-900 sm:max-w-[140px] lg:max-w-[160px]">
                  {currentUser.name}
                </p>
                <p className="max-w-[100px] truncate text-xs text-slate-500 sm:max-w-[140px] lg:max-w-[160px]">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <Link to="/login" className="btn-header-secondary" aria-label="Home">
              <span className="hidden min-[480px]:inline">Home</span>
              <svg className="h-4 w-4 min-[480px]:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <button type="button" onClick={handleLogout} className="btn-header-logout" aria-label="Logout">
              <span className="hidden min-[480px]:inline">Logout</span>
              <svg className="h-4 w-4 min-[480px]:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
