import { Link } from 'react-router-dom';

export function GuestRegisterHero() {
  return (
    <section className="guest-register-hero animate-fade-in">
      <div className="guest-hero-glow guest-hero-glow-a guest-register-glow" aria-hidden="true" />
      <div className="guest-hero-glow guest-hero-glow-b guest-register-glow-b" aria-hidden="true" />
      <div className="relative z-10">
        <span className="guest-section-badge">Join the Platform</span>
        <h1 className="guest-register-title">Create Your Account</h1>
        <p className="guest-register-desc">
          Choose your role, register in seconds, and step into a personalized blue-emerald security
          dashboard.
        </p>
        <div className="guest-register-actions">
          <Link to="/login" className="btn-auth-outline px-5 py-2.5 text-sm">
            ← Back to Sign In
          </Link>
          <Link to="/login#how-it-works" className="guest-cta-ghost text-sm">
            Platform Guide
          </Link>
        </div>
      </div>
    </section>
  );
}
