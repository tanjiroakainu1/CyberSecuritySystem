import { Link } from 'react-router-dom';
import { ROLE_LIST } from '@/types/roles';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';

interface GuestHomeHeroProps {
  activeUsers: number;
  incidentCount: number;
}

const pillars = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Protect',
    desc: 'Enterprise-grade security controls',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Monitor',
    desc: 'Real-time incidents & alerts',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Comply',
    desc: 'Policies, training & audits',
  },
];

export function GuestHomeHero({ activeUsers, incidentCount }: GuestHomeHeroProps) {
  return (
    <section className="guest-hero animate-fade-in">
      <div className="guest-hero-grid" aria-hidden="true" />
      <div className="guest-hero-glow guest-hero-glow-a" aria-hidden="true" />
      <div className="guest-hero-glow guest-hero-glow-b" aria-hidden="true" />
      <div className="guest-hero-shimmer" aria-hidden="true" />

      <div className="guest-hero-content">
        <div className="guest-hero-top">
          <div className="guest-shield-wrap animate-float">
            <span className="guest-shield-ring guest-shield-ring-1" />
            <span className="guest-shield-ring guest-shield-ring-2" />
            <div className="guest-shield-icon">
              <svg className="h-12 w-12 sm:h-14 sm:w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>

          <div className="guest-hero-text">
            <span className="guest-hero-eyebrow">
              <span className="guest-live-dot" />
              Secure · Blue &amp; Emerald Platform
            </span>
            <h1 className="guest-hero-title">
              Cybersecurity
              <span className="guest-hero-title-accent"> Management System</span>
            </h1>
            <p className="guest-hero-desc">
              One polished hub for monitoring, incidents, risk, compliance, and training — designed
              for every role in your organization.
            </p>
          </div>
        </div>

        <div className="guest-stats">
          <div className="guest-stat">
            <span className="guest-stat-value">{activeUsers}</span>
            <span className="guest-stat-label">Active Users</span>
          </div>
          <div className="guest-stat-divider" />
          <div className="guest-stat">
            <span className="guest-stat-value">{ROLE_LIST.length}</span>
            <span className="guest-stat-label">Dashboards</span>
          </div>
          <div className="guest-stat-divider" />
          <div className="guest-stat">
            <span className="guest-stat-value">{incidentCount}</span>
            <span className="guest-stat-label">Live Incidents</span>
          </div>
        </div>

        <div className="guest-pillars">
          {pillars.map((p) => (
            <div key={p.title} className="guest-pillar">
              <span className="guest-pillar-icon-wrap">{p.icon}</span>
              <div>
                <p className="guest-pillar-title">{p.title}</p>
                <p className="guest-pillar-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="guest-cta-row">
          <a href="#sign-in" className="btn-primary guest-cta-primary">
            Sign In Now
          </a>
          <a href="#how-it-works" className="btn-auth-outline guest-cta-secondary">
            Explore Platform
          </a>
          <Link to="/register" className="guest-cta-emerald">
            Create Account →
          </Link>
        </div>

        <div className="guest-trust-row">
          {['Role-based access', 'Live demo data', 'Instant dashboards'].map((item) => (
            <span key={item} className="guest-trust-chip">
              ✓ {item}
            </span>
          ))}
        </div>

        <div className="flex justify-center pt-5">
          <DeveloperCredit variant="badge" />
        </div>
      </div>
    </section>
  );
}
