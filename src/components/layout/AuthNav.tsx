import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { label: 'Sign In', to: '/login', hash: '#sign-in' },
  { label: 'Platform Guide', to: '/login', hash: '#how-it-works' },
  { label: 'Register', to: '/register' },
];

export function AuthNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="auth-nav">
        <div className="auth-nav-inner">
          <Link to="/login" className="auth-nav-brand" onClick={closeMenu}>
            <span className="auth-nav-logo">CMS</span>
            <span className="hidden sm:inline">
              <span className="bg-gradient-to-r from-white to-cyber-200 bg-clip-text text-transparent">
                Cybersecurity System
              </span>
            </span>
          </Link>

          <div className="auth-nav-links hidden sm:flex">
            {links.map((link) => {
              const isActive =
                link.to === location.pathname &&
                (link.hash
                  ? location.hash === link.hash || (!location.hash && link.hash === '#sign-in')
                  : true);
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
              const isActive =
                link.to === location.pathname &&
                (link.hash
                  ? location.hash === link.hash || (!location.hash && link.hash === '#sign-in')
                  : true);
              const href = link.hash ? `${link.to}${link.hash}` : link.to;

              return (
                <Link
                  key={link.label}
                  to={href}
                  onClick={closeMenu}
                  className={`auth-mobile-link ${isActive ? 'auth-mobile-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
