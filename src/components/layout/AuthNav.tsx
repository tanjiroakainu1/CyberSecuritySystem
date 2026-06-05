import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { label: 'Home', to: '/login', hash: '' },
  { label: 'Sign In', to: '/login', hash: '#sign-in' },
  { label: 'Guide', to: '/login', hash: '#how-it-works' },
];

export function AuthNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const isRegister = location.pathname === '/register';

  return (
    <>
      <nav className="auth-nav">
        <div className="auth-nav-inner">
          <Link to="/login" className="auth-nav-brand" onClick={closeMenu}>
            <span className="auth-nav-logo">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <span className="hidden sm:inline">
              <span className="auth-nav-brand-text">Cybersecurity System</span>
            </span>
          </Link>

          <div className="auth-nav-links hidden sm:flex">
            {links.map((link) => {
              const isActive =
                !isRegister &&
                link.to === location.pathname &&
                (link.hash
                  ? location.hash === link.hash
                  : !location.hash || location.hash === '');
              const href = link.hash ? `${link.to}${link.hash}` : link.to;

              return (
                <Link
                  key={link.label}
                  to={href}
                  className={`auth-nav-link ${isActive ? 'auth-nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/register"
              className={`auth-nav-cta ${isRegister ? 'auth-nav-cta-active' : ''}`}
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            className="menu-toggle-auth sm:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            className="auth-menu-overlay sm:hidden"
            onClick={closeMenu}
            aria-label="Close menu overlay"
          />
          <div className="auth-mobile-menu sm:hidden">
            {links.map((link) => {
              const href = link.hash ? `${link.to}${link.hash}` : link.to;
              return (
                <Link key={link.label} to={href} onClick={closeMenu} className="auth-mobile-link">
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/register"
              onClick={closeMenu}
              className={`auth-mobile-link ${isRegister ? 'auth-mobile-link-active' : ''}`}
            >
              Register
            </Link>
          </div>
        </>
      )}
    </>
  );
}
