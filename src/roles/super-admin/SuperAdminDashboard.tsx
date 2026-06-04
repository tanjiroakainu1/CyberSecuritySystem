import { PageHeader, StatCard, FeatureCard } from '@/components/ui/PageComponents';
import { CrudTable } from '@/components/ui/CrudComponents';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { formatDateShort } from '@/lib/storage';
import { countUniqueRoles } from '@/lib/storeStats';

export function SuperAdminDashboard() {
  const { store } = useData();

  const activeUsers = store.users.filter((u) => u.status === 'Active').length;
  const draftPolicies = store.policies.filter((p) => p.status === 'Draft').length;
  const openIncidents = store.incidents.filter((i) => !['Closed', 'Resolved'].includes(i.status)).length;

  return (
    <div className="page-container">
      <PageHeader
        title="Super Admin Dashboard"
        description="Full system access — manage users, policies, settings, and system-wide operations."
      />

      <div className="grid-stats">
        <StatCard label="Total Users" value={store.users.length} change={`${activeUsers} active`} trend="up" />
        <StatCard label="Roles In Use" value={countUniqueRoles(store.users)} change={`${store.users.length} total accounts`} trend="neutral" />
        <StatCard label="Security Policies" value={store.policies.length} change={`${draftPolicies} draft`} trend="neutral" />
        <StatCard label="Open Incidents" value={openIncidents} change={`${store.activities.length} logged events`} trend="neutral" />
      </div>

      <div className="grid-features">
        <Link className="feature-card-link" to="/super-admin/users-roles"><FeatureCard title="Manage Users & Roles" description={`${store.users.length} users registered`} status="active" /></Link>
        <Link className="feature-card-link" to="/super-admin/security-policies"><FeatureCard title="Configure Security Policies" description={`${store.policies.filter((p) => p.status === 'Active').length} active policies`} status="active" /></Link>
        <Link className="feature-card-link" to="/super-admin/system-settings"><FeatureCard title="System Settings" description={`${store.systemSettings.length} configurable settings`} status="active" /></Link>
        <Link className="feature-card-link" to="/super-admin/cybersecurity-activities"><FeatureCard title="Cybersecurity Activities" description={`${store.activities.length} recorded events`} status="active" /></Link>
        <Link className="feature-card-link" to="/super-admin/system-reports"><FeatureCard title="System Reports" description={`${store.reports.length} reports generated`} status="active" /></Link>
        <Link className="feature-card-link" to="/super-admin/backup-restore"><FeatureCard title="Backup & Restore" description={`${store.backups.length} backups on record`} status={store.backups.length > 0 ? 'active' : 'warning'} /></Link>
      </div>

      <h2 className="section-title mb-4">Recent System Activity</h2>
      <CrudTable
        headers={['Action', 'User', 'Module', 'Timestamp']}
        rows={store.activities.slice(0, 8).map((a) => [a.action, a.user, a.module, formatDateShort(a.createdAt)])}
      />
    </div>
  );
}
