import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Field, TextInput } from '@/components/ui/CrudComponents';
import { AuthNav } from '@/components/layout/AuthNav';
import { GuestHomeHero } from '@/components/home/GuestHomeHero';
import { SystemFlowSection } from '@/components/home/SystemFlowSection';
import { useData } from '@/context/DataContext';
import { ROLES, ROLE_LIST, RoleId } from '@/types/roles';
import { User } from '@/types/entities';
import { getRoleQuickAccessUsers } from '@/lib/storeStats';
import { useBodyTheme } from '@/hooks/useBodyTheme';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';

export function LoginPage() {
  const { store, login, quickLogin } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  useBodyTheme('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const quickAccessUsers = getRoleQuickAccessUsers(store.users);
  const activeUsers = store.users.filter((u) => u.status === 'Active').length;

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email.trim(), password);
    if (user) {
      navigate(ROLES[user.roleId].dashboardPath);
    } else {
      setError('Invalid email or password. Use a registered account or quick access.');
    }
  };

  const handleQuickAccess = (roleId: RoleId) => {
    setError('');
    const user = quickLogin(roleId);
    if (user) {
      navigate(ROLES[roleId].dashboardPath);
    } else {
      setError(`No active user found for ${ROLES[roleId].name}. Register or ask an admin to create one.`);
    }
  };

  const fillCredentials = (user: User) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    document.getElementById('sign-in')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="auth-bg">
      <AuthNav />

      <div className="auth-page auth-page-home">
        <GuestHomeHero activeUsers={activeUsers} incidentCount={store.incidents.length} />

        <section id="sign-in" className="guest-signin scroll-mt-20">
          <div className="guest-section-head guest-section-head-left">
            <span className="guest-section-badge">Get Started</span>
            <h2 className="guest-section-title">Sign In &amp; Quick Access</h2>
            <p className="guest-section-desc">
              Log in with your credentials or use one-click access for any of the five roles.
            </p>
          </div>

          <div className="auth-grid">
            <div className="auth-panel auth-panel-glow auth-panel-equal">
              <div className="auth-panel-header">
                <div className="flex items-center gap-3">
                  <span className="auth-panel-icon">🔐</span>
                  <div>
                    <h2 className="auth-panel-title">Sign In</h2>
                    <p className="auth-panel-subtitle">Email &amp; password authentication</p>
                  </div>
                </div>
              </div>

              <div className="auth-panel-body">
                {error && (
                  <div className="auth-error">
                    <span>⚠</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-1 flex-col space-y-4">
                  <Field label="Email" dark>
                    <TextInput
                      dark
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field label="Password" dark>
                    <TextInput
                      dark
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </Field>
                  <div className="mt-auto space-y-4 pt-2">
                    <button type="submit" className="btn-primary w-full py-3 text-base font-bold">
                      Login to Dashboard →
                    </button>
                    <p className="text-center text-sm text-slate-400">
                      New here?{' '}
                      <Link to="/register" className="auth-link">
                        Create your account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="auth-panel auth-panel-glow auth-panel-equal">
              <div className="auth-panel-header">
                <div className="flex items-center gap-3">
                  <span className="auth-panel-icon">⚡</span>
                  <div>
                    <h2 className="auth-panel-title">Quick Access</h2>
                    <p className="auth-panel-subtitle">Instant demo login per role</p>
                  </div>
                </div>
                <span className="auth-badge-accent">
                  {quickAccessUsers.length}/{ROLE_LIST.length}
                </span>
              </div>

              <div className="auth-panel-body justify-center space-y-2.5">
                {ROLE_LIST.map((role, index) => {
                  const user = quickAccessUsers.find((u) => u.roleId === role.id);
                  return (
                    <div key={role.id} className="auth-role-row auth-role-row-premium">
                      <span className="auth-role-index">{index + 1}</span>
                      <span
                        className={`auth-role-avatar bg-gradient-to-br ${role.color}`}
                      >
                        {user ? user.name.charAt(0) : '?'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">{role.name}</p>
                        {user ? (
                          <p className="truncate text-xs text-slate-400">{user.email}</p>
                        ) : (
                          <p className="text-xs text-amber-400">No active user</p>
                        )}
                      </div>
                      {user && (
                        <div className="auth-role-actions">
                          <button
                            type="button"
                            onClick={() => handleQuickAccess(role.id)}
                            className="btn-primary px-3 py-2 text-xs font-bold"
                          >
                            Enter
                          </button>
                          <button
                            type="button"
                            onClick={() => fillCredentials(user)}
                            className="btn-auth-outline px-3 py-2 text-xs"
                          >
                            Fill
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <SystemFlowSection />

        <DeveloperCredit variant="banner" className="mt-12" />
      </div>
    </div>
  );
}
