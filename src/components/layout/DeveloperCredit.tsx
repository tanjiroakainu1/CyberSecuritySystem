import { DEVELOPER, DeveloperCreditVariant } from '@/constants/developer';

interface DeveloperCreditProps {
  variant?: DeveloperCreditVariant;
  className?: string;
}

function DevAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
  };

  return (
    <div className={`developer-avatar ${sizes[size]}`}>
      <span className="developer-avatar-ring" aria-hidden="true" />
      <span className="relative font-bold tracking-tight">{DEVELOPER.initials}</span>
    </div>
  );
}

function CodeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
    </svg>
  );
}

export function DeveloperCredit({ variant = 'banner', className = '' }: DeveloperCreditProps) {
  if (variant === 'badge') {
    return (
      <div className={`developer-badge ${className}`} title={`Built by ${DEVELOPER.name}`}>
        <SparkIcon />
        <span className="developer-badge-label">Built by</span>
        <span className="developer-badge-name">{DEVELOPER.name}</span>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`developer-sidebar ${className}`}>
        <DevAvatar size="sm" />
        <div className="min-w-0 flex-1">
          <p className="developer-sidebar-label">
            <CodeIcon />
            {DEVELOPER.role}
          </p>
          <p className="developer-name-sm truncate">{DEVELOPER.name}</p>
        </div>
      </div>
    );
  }

  if (variant === 'strip') {
    return (
      <footer className={`developer-strip ${className}`}>
        <div className="developer-strip-inner">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <DevAvatar size="sm" />
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                System built by
              </p>
              <p className="developer-name-md">{DEVELOPER.name}</p>
            </div>
            <span className="hidden h-8 w-px bg-slate-200 sm:block" />
            <p className="max-w-xs text-center text-xs text-slate-500 sm:text-left">
              {DEVELOPER.title}
            </p>
            <span className="hidden h-8 w-px bg-slate-200 md:block" />
            <div className="flex flex-wrap justify-center gap-1.5">
              {DEVELOPER.stack.map((tech) => (
                <span key={tech} className="developer-tech-pill">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-widest text-slate-400">
            CMS v{DEVELOPER.version} · {DEVELOPER.tagline}
          </p>
        </div>
      </footer>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`developer-card ${className}`}>
        <div className="developer-card-glow" aria-hidden="true" />
        <div className="developer-card-inner">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <DevAvatar size="lg" />
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="developer-role-chip">{DEVELOPER.role}</span>
                <span className="developer-live-dot">
                  <span className="developer-live-pulse" />
                  Active Build
                </span>
              </div>
              <h3 className="developer-name-lg">{DEVELOPER.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{DEVELOPER.title}</p>
              <p className="mt-2 text-sm italic text-cyber-600">{DEVELOPER.tagline}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {DEVELOPER.stack.map((tech) => (
              <span key={tech} className="developer-tech-pill developer-tech-pill-light">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`developer-banner ${className}`}>
      <div className="developer-banner-orbs" aria-hidden="true">
        <span className="developer-orb developer-orb-a" />
        <span className="developer-orb developer-orb-b" />
      </div>
      <div className="developer-banner-content">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <DevAvatar size="lg" />
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="developer-role-chip developer-role-chip-dark">
                <CodeIcon />
                {DEVELOPER.role}
              </span>
              <span className="developer-version-chip">v{DEVELOPER.version}</span>
            </div>
            <h2 className="developer-name-xl">{DEVELOPER.name}</h2>
            <p className="mt-1 text-sm font-medium text-cyber-300">{DEVELOPER.title}</p>
            <p className="mt-3 text-sm text-slate-400">{DEVELOPER.tagline}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {DEVELOPER.stack.map((tech) => (
              <span key={tech} className="developer-tech-pill developer-tech-pill-dark">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="developer-banner-footer">
          <SparkIcon />
          <span>Cybersecurity Management System — engineered end-to-end by {DEVELOPER.name}</span>
          <SparkIcon />
        </div>
      </div>
    </div>
  );
}
