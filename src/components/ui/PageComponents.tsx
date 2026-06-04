import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="page-header animate-slide-up">
      <div className="min-w-0 flex-1">
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
}

const trendIcons = {
  up: '↑',
  down: '↓',
  neutral: '•',
};

export function StatCard({ label, value, change, trend = 'neutral', icon }: StatCardProps) {
  const trendColor =
    trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500';

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 min-[480px]:text-sm">
          {label}
        </p>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-100 to-violet-100 text-cyber-600 shadow-soft transition-transform duration-300 group-hover:scale-110">
          {icon ?? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
        </div>
      </div>
      <p className="mt-2 bg-gradient-to-r from-slate-900 to-cyber-800 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent min-[480px]:mt-3 min-[480px]:text-3xl">
        {value}
      </p>
      {change && (
        <p className={`mt-1 flex items-center gap-1 text-xs font-semibold min-[480px]:mt-1.5 ${trendColor}`}>
          <span>{trendIcons[trend]}</span>
          {change}
        </p>
      )}
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  status?: 'active' | 'warning' | 'inactive';
}

export function FeatureCard({ title, description, icon, status = 'active' }: FeatureCardProps) {
  const statusStyles = {
    active: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-white to-cyber-50/30',
    warning: 'border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/30',
    inactive: 'border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100/50',
  };

  const dotColor = {
    active: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    warning: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    inactive: 'bg-slate-400',
  };

  return (
    <div className={`feature-card-inner group card border-2 ${statusStyles[status]}`}>
      <div className="flex items-start gap-3 min-[480px]:gap-4">
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyber-600 shadow-soft transition-transform duration-300 group-hover:scale-105 min-[480px]:h-11 min-[480px]:w-11">
            {icon}
          </div>
        ) : (
          <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[status]}`} />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 min-[480px]:text-base">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 min-[480px]:mt-1.5 min-[480px]:text-sm">
            {description}
          </p>
        </div>
        <span className="feature-card-arrow" aria-hidden="true">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
}

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((row, i) => (
          <div key={i} className="table-mobile-card animate-scale-in">
            <div className="space-y-3">
              {row.map((cell, j) => (
                <div key={j}>
                  <p className="table-mobile-label">{headers[j]}</p>
                  <p className="table-mobile-value break-words">{cell}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrapper hidden md:block">
        <div className="table-scroll">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-cyber-50/30">
                {headers.map((header) => (
                  <th key={header} className="table-th">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row, i) => (
                <tr key={i} className="transition-colors hover:bg-cyber-50/40">
                  {row.map((cell, j) => (
                    <td key={j} className="table-td">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

interface ActionListProps {
  items: { label: string; description: string }[];
}

export function ActionList({ items }: ActionListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50 p-3 shadow-soft transition-all duration-300 min-[480px]:p-4 hover:border-cyber-200 hover:shadow-glow"
        >
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyber-500 to-violet-600 text-xs font-bold text-white shadow-sm">
            ✓
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{item.label}</p>
            <p className="mt-0.5 text-sm text-slate-600">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
