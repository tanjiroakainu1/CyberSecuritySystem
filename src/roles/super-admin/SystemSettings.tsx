import { PageHeader, FeatureCard, SectionTitle } from '@/components/ui/PageComponents';
import { Field, TextInput, SelectInput } from '@/components/ui/CrudComponents';
import { DeveloperCredit } from '@/components/layout/DeveloperCredit';
import { useData } from '@/context/DataContext';
import { SystemSetting } from '@/types/entities';
import { countTotalRecords, getStoreDataSize } from '@/lib/storeStats';

export function SystemSettings() {
  const { store, updateSystemSetting } = useData();

  const mfaSetting = store.systemSettings.find((s) => s.key === 'mfa_required');
  const retentionSetting = store.systemSettings.find((s) => s.key === 'audit_retention');
  const backupSetting = store.systemSettings.find((s) => s.key === 'backup_schedule');
  const sessionSetting = store.systemSettings.find((s) => s.key === 'session_timeout');

  return (
    <div className="page-container">
      <PageHeader
        title="System Settings"
        description="Configure global system settings. Changes apply immediately across the system."
      />

      <div className="grid-cards-3">
        <FeatureCard title="Total Users" description={`${store.users.length} registered (${store.users.filter((u) => u.status === 'Active').length} active)`} status="active" />
        <FeatureCard title="System Records" description={`${countTotalRecords(store)} total records`} status="active" />
        <FeatureCard title="Data Size" description={getStoreDataSize()} status="active" />
      </div>

      <div className="mb-8 grid gap-4">
        {store.systemSettings.map((setting: SystemSetting) => (
          <div key={setting.id} className="card">
            <Field label={`${setting.label} (${setting.category})`}>
              {setting.key === 'mfa_required' ? (
                <SelectInput
                  value={setting.value}
                  onChange={(e) => updateSystemSetting(setting.id, e.target.value)}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </SelectInput>
              ) : (
                <TextInput
                  value={setting.value}
                  onChange={(e) => updateSystemSetting(setting.id, e.target.value)}
                />
              )}
            </Field>
          </div>
        ))}
      </div>

      <div className="grid-cards-2">
        <FeatureCard title="Authentication" description={`MFA: ${mfaSetting?.value === 'true' ? 'Enabled' : 'Disabled'} · Session: ${sessionSetting?.value ?? '30'} min`} status="active" />
        <FeatureCard title="Audit Logs" description={`Retention: ${retentionSetting?.value ?? '365'} days · ${store.activities.length} events logged`} status="active" />
        <FeatureCard title="Backup Schedule" description={backupSetting?.value ?? 'Not configured'} status="active" />
        <FeatureCard title="Backups on Record" description={`${store.backups.length} backup(s) created`} status={store.backups.length > 0 ? 'active' : 'warning'} />
      </div>

      <SectionTitle>System Developer</SectionTitle>
      <DeveloperCredit variant="card" />
    </div>
  );
}
