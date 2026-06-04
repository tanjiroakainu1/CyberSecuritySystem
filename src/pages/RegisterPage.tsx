import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Field, TextInput, SelectInput } from '@/components/ui/CrudComponents';
import { AuthNav } from '@/components/layout/AuthNav';
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
        <div className="guest-register-hero animate-fade-in">
          <span className="guest-section-badge">Join the Platform</span>
          <h1 className="mt-4">Create Your Account</h1>
          <p>
            Pick your role, register in seconds, and land on a personalized security dashboard.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/login" className="btn-auth-outline px-4 py-2 text-xs">
              Back to Sign In
            </Link>
            <Link to="/login#how-it-works" className="guest-cta-ghost text-xs">
              Platform Guide →
            </Link>
          </div>
        </div>

        <div className="auth-grid">
          <div className="auth-panel auth-panel-glow auth-panel-equal">
            <div className="auth-panel-header">
              <div className="flex items-center gap-3">
                <span className="auth-panel-icon">✨</span>
                <div>
                  <h1 className="auth-panel-title">Registration</h1>
                  <p className="auth-panel-subtitle">Any role — instant dashboard access</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-0">
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

              <button type="submit" className="btn-primary w-full py-3.5 text-base font-bold">
                Register &amp; Enter Dashboard →
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
              {' · '}
              <Link to="/login#how-it-works" className="auth-link">
                Platform Guide
              </Link>
            </p>
          </div>

          <div className="auth-panel auth-panel-glow auth-panel-equal">
            <div className="auth-panel-header">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${selectedRole.color} text-sm font-bold text-white shadow-md`}
                >
                  {selectedRole.name.charAt(0)}
                </div>
                <div>
                  <h2 className="auth-panel-title">{selectedRole.name}</h2>
                  <p className="auth-panel-subtitle">{selectedRole.description}</p>
                </div>
              </div>
            </div>

            {selectedFlow && (
              <>
                <p className="mb-5 rounded-xl bg-slate-900/50 px-4 py-3 text-xs leading-relaxed text-cyber-300">
                  <span className="font-bold">Workflow: </span>
                  {selectedFlow.workflow[0]}
                </p>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your capabilities
                </p>
                <ul className="mb-6 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {selectedFlow.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="rounded-xl border border-slate-600/40 bg-slate-900/30 px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-white">{feature.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{feature.description}</p>
                    </li>
                  ))}
                </ul>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dashboard navigation
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.navItems.map((item) => (
                    <span
                      key={item.path}
                      className="rounded-full border border-slate-600/60 bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <DeveloperCredit variant="banner" className="mt-8" />
      </div>
    </div>
  );
}
