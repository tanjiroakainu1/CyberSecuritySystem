import { FormEvent, useState } from 'react';
import { PageHeader, FeatureCard } from '@/components/ui/PageComponents';
import { Field, FormActions, TextInput } from '@/components/ui/CrudComponents';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/lib/storage';

const passwordDefaults = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function AccountCredentials() {
  const { store, currentUser, update, updateCredentials, logActivity, showToast } = useData();
  const [form, setForm] = useState(passwordDefaults);

  const credentials = store.credentials;
  const lastLogin = currentUser?.lastLogin ?? credentials.lastLogin;

  const handleChangePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('You must be logged in to change your password');
      return;
    }

    if (form.currentPassword !== currentUser.password) {
      showToast('Current password is incorrect');
      return;
    }

    if (form.newPassword.length < 6) {
      showToast('New password must be at least 6 characters');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showToast('New password and confirmation do not match');
      return;
    }

    update('users', currentUser.id, { password: form.newPassword });
    updateCredentials({
      passwordLastChanged: new Date().toISOString(),
      lastLogin,
    });

    logActivity('Password changed', 'Account Credentials');
    showToast('Password updated successfully');
    setForm(passwordDefaults);
  };

  const toggleMfa = () => {
    updateCredentials({ mfaEnabled: !credentials.mfaEnabled });
    logActivity(
      `MFA ${credentials.mfaEnabled ? 'disabled' : 'enabled'}`,
      'Account Credentials',
    );
    showToast(`MFA ${credentials.mfaEnabled ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Account Credentials Management"
        description={currentUser ? `Managing account for ${currentUser.name} (${currentUser.email})` : 'Manage your account credentials'}
        actions={
          <button type="button" className="btn-secondary" onClick={toggleMfa}>
            {credentials.mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
          </button>
        }
      />

      <div className="card mb-6">
        <form id="change-password-form" className="space-y-4" onSubmit={handleChangePassword}>
          <Field label="Current Password">
            <TextInput
              required
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
            />
          </Field>

          <Field label="New Password">
            <TextInput
              required
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            />
          </Field>

          <Field label="Confirm New Password">
            <TextInput
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </Field>

          <FormActions onCancel={() => setForm(passwordDefaults)} submitLabel="Change Password" />
        </form>
      </div>

      <div className="grid-cards-2">
        <FeatureCard title="Account Name" description={currentUser?.name ?? '—'} status="active" />
        <FeatureCard title="Email" description={currentUser?.email ?? '—'} status="active" />
        <FeatureCard title="Role" description={currentUser?.role ?? '—'} status="active" />
        <FeatureCard title="Password Last Changed" description={formatDate(credentials.passwordLastChanged)} status="active" />
        <FeatureCard
          title="Multi-Factor Authentication"
          description={credentials.mfaEnabled ? 'Enabled' : 'Disabled'}
          status={credentials.mfaEnabled ? 'active' : 'warning'}
        />
        <FeatureCard title="Last Login" description={formatDate(lastLogin)} status="active" />
        <FeatureCard
          title="Security Questions"
          description={credentials.securityQuestionsConfigured ? 'Configured' : 'Not configured'}
          status={credentials.securityQuestionsConfigured ? 'active' : 'inactive'}
        />
        <FeatureCard title="Account Status" description={currentUser?.status ?? '—'} status={currentUser?.status === 'Active' ? 'active' : 'inactive'} />
      </div>
    </div>
  );
}
