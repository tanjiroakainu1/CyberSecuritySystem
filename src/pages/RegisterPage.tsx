import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Field, TextInput, SelectInput } from '@/components/ui/CrudComponents';
import { AuthNav } from '@/components/layout/AuthNav';
import { GuestRegisterHero } from '@/components/home/GuestRegisterHero';
import { useData } from '@/context/DataContext';
import { ROLES, ROLE_LIST, RoleId } from '@/types/roles';
import { getRoleFlow } from '@/data/systemFlow';
import { useBodyTheme } from '@/hooks/useBodyTheme';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';

export function RegisterPage() {
  const { register } = useData();
  const navigate = useNavigate();
  useBodyTheme('auth');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: 'employee' as RoleId,
  });
  const [error, setError] = useState('');

  const selectedRole = ROLES[form.roleId];
  const selectedFlow = getRoleFlow(form.roleId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const user = register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      roleId: form.roleId,
    });

    if (user) {
      navigate(ROLES[user.roleId].dashboardPath);
    }
  };

  return (
    <div className="auth-bg">
      <AuthNav />

      <div className="auth-page auth-page-home">
        <GuestRegisterHero />

        <div className="guest-section-head guest-section-head-left guest-signin">
          <span className="guest-section-badge">Registration</span>
          <h2 className="guest-section-title">Build Your Account</h2>
          <p className="guest-section-desc">
            Select a role, fill in your details, and launch straight into your dashboard.
          </p>
        </div>

        <div className="auth-grid">
          <div className="auth-panel auth-panel-glow auth-panel-equal">
            <div className="auth-panel-header">
              <div className="flex items-center gap-3">
                <span className="auth-panel-icon auth-panel-icon-emerald">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </span>
                <div>
                  <h1 className="auth-panel-title">Your Details</h1>
                  <p className="auth-panel-subtitle">All fields required · min. 6 char password</p>
                </div>
              </div>
            </div>

            <div className="auth-panel-body">
              <p className="auth-section-label mb-3 text-left">Choose your role</p>
              <div className="guest-role-picker mb-5">
                {ROLE_LIST.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setForm({ ...form, roleId: role.id })}
                    className={`guest-role-picker-btn ${form.roleId === role.id ? 'guest-role-picker-btn-active' : ''}`}
                  >
                    <span className={`guest-role-picker-avatar bg-gradient-to-br ${role.color}`}>
                      {role.name.charAt(0)}
                    </span>
                    <span className="guest-role-picker-name">{role.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col space-y-4">
                {error && (
                  <div className="auth-error">
                    <span>⚠</span> {error}
                  </div>
                )}

                <Field label="Full Name" dark>
                  <TextInput
                    dark
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </Field>

                <Field label="Email" dark>
                  <TextInput
                    dark
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                  />
                </Field>

                <Field label="Role" dark>
                  <SelectInput
                    dark
                    required
                    value={form.roleId}
                    onChange={(e) => setForm({ ...form, roleId: e.target.value as RoleId })}
                  >
                    {ROLE_LIST.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Password" dark>
                  <TextInput
                    dark
                    required
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                  />
                </Field>

                <Field label="Confirm Password" dark>
                  <TextInput
                    dark
                    required
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                  />
                </Field>

                <button type="submit" className="btn-primary mt-2 w-full py-3.5 text-base font-bold">
                  Register &amp; Enter Dashboard →
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-panel auth-panel-glow auth-panel-equal auth-panel-preview">
            <div className="auth-panel-header">
              <div className="flex items-center gap-3">
                <span className={`auth-role-avatar h-11 w-11 text-base bg-gradient-to-br ${selectedRole.color}`}>
                  {selectedRole.name.charAt(0)}
                </span>
                <div>
                  <h2 className="auth-panel-title">{selectedRole.name}</h2>
                  <p className="auth-panel-subtitle">{selectedRole.description}</p>
                </div>
              </div>
            </div>

            <div className="auth-panel-body">
              {selectedFlow && (
                <>
                  <div className="guest-workflow-banner mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Workflow
                    </span>
                    <p className="mt-1 text-sm text-slate-300">{selectedFlow.workflow[0]}</p>
                  </div>

                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your capabilities
                  </p>
                  <ul className="mb-6 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {selectedFlow.features.map((feature) => (
                      <li key={feature.title} className="guest-feature-item guest-feature-item-compact">
                        <span className="guest-feature-check">✦</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{feature.title}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                            {feature.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

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
                </>
              )}
            </div>
          </div>
        </div>

        <DeveloperCredit variant="banner" className="mt-10" />
      </div>
    </div>
  );
}
