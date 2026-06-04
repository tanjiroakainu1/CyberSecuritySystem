import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SYSTEM_FLOW_STEPS,
  CROSS_ROLE_FLOW,
  ROLE_FLOWS,
} from '@/data/systemFlow';
import { ROLES, ROLE_LIST, RoleId } from '@/types/roles';

export function SystemFlowSection() {
  const [activeRole, setActiveRole] = useState<RoleId>('super-admin');

  const selectedFlow = ROLE_FLOWS.find((r) => r.roleId === activeRole)!;
  const selectedRole = ROLES[activeRole];

  return (
    <section id="how-it-works" className="guest-guide scroll-mt-20">
      <div className="guest-section-head">
        <span className="guest-section-badge">Platform Guide</span>
        <h2 className="guest-section-title">How the System Works</h2>
        <p className="guest-section-desc">
          Walk through the full platform flow — from login to cross-role collaboration — before you
          enter your dashboard.
        </p>
      </div>

      {/* Timeline flow */}
      <div className="guest-block">
        <h3 className="guest-block-title">
          <span className="guest-block-icon">01</span>
          Your Journey
        </h3>
        <div className="guest-timeline">
          {SYSTEM_FLOW_STEPS.map((step, i) => (
            <div key={step.step} className="guest-timeline-step">
              <div className="guest-timeline-marker">
                <span className="guest-timeline-num">{step.step}</span>
                {i < SYSTEM_FLOW_STEPS.length - 1 && <span className="guest-timeline-line" />}
              </div>
              <div className="guest-timeline-card">
                <h4 className="font-bold text-white">{step.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-role pipeline */}
      <div className="guest-block">
        <h3 className="guest-block-title">
          <span className="guest-block-icon">02</span>
          Cross-Role Intelligence
        </h3>
        <div className="guest-pipeline">
          {CROSS_ROLE_FLOW.map((flow, i) => (
            <div key={i} className="guest-pipeline-item">
              <div className="guest-pipeline-node from">{flow.from}</div>
              <div className="guest-pipeline-arrow">
                <span className="guest-pipeline-action">{flow.action}</span>
                <svg className="h-5 w-5 shrink-0 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="guest-pipeline-node to">{flow.to}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role capabilities */}
      <div className="guest-block">
        <h3 className="guest-block-title">
          <span className="guest-block-icon">03</span>
          Role Capabilities
        </h3>
        <div className="guest-role-grid">
          {ROLE_LIST.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveRole(role.id)}
              className={`guest-role-card ${activeRole === role.id ? 'guest-role-card-active' : ''}`}
            >
              <span className={`guest-role-card-avatar bg-gradient-to-br ${role.color}`}>
                {role.name.charAt(0)}
              </span>
              <span className="guest-role-card-name">{role.name}</span>
              {activeRole === role.id && <span className="guest-role-card-dot" />}
            </button>
          ))}
        </div>

        <div className="guest-role-detail auth-panel">
          <div className="guest-role-detail-header">
            <span className={`guest-role-detail-avatar bg-gradient-to-br ${selectedRole.color}`}>
              {selectedRole.name.charAt(0)}
            </span>
            <div>
              <h4 className="text-xl font-bold text-white">{selectedRole.name}</h4>
              <p className="mt-1 text-sm text-slate-400">{selectedRole.description}</p>
            </div>
          </div>

          <div className="guest-workflow-banner">
            <span className="text-xs font-bold uppercase tracking-wider text-cyber-400">Workflow</span>
            <p className="mt-1 text-sm text-slate-300">{selectedFlow.workflow[0]}</p>
          </div>

          <div className="guest-feature-grid">
            {selectedFlow.features.map((feature) => (
              <div key={feature.title} className="guest-feature-item">
                <span className="guest-feature-check">✦</span>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Dashboard navigation
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedRole.navItems.map((item) => (
                <span key={item.path} className="guest-module-tag">
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="guest-final-cta auth-cta-box">
        <div className="guest-final-cta-icon" aria-hidden="true">🚀</div>
        <h3 className="text-2xl font-bold text-white">Ready to enter the platform?</h3>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
          Jump in with quick access, sign in with your credentials, or register a new account in
          seconds.
        </p>
        <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:justify-center min-[480px]:gap-4">
          <a href="#sign-in" className="btn-primary w-full px-8 py-3.5 min-[480px]:w-auto">
            Sign In
          </a>
          <Link to="/register" className="btn-auth-outline w-full px-8 py-3.5 min-[480px]:w-auto">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
