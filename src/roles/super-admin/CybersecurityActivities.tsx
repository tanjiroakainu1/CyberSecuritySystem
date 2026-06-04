import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import { CrudTable } from '@/components/ui/CrudComponents';
import { useData } from '@/context/DataContext';
import { formatDateShort } from '@/lib/storage';

export function CybersecurityActivities() {
  const { store } = useData();

  return (
    <div className="page-container">
      <PageHeader title="Cybersecurity Activities" description="All activities logged when system operations occur." />

      <div className="grid-stats">
        <StatCard label="Total Events" value={store.activities.length} change="Persisted locally" trend="neutral" />
        <StatCard label="Alerts" value={store.alerts.length} change={`${store.alerts.filter((a) => a.status === 'Open').length} open`} trend="neutral" />
        <StatCard label="Incidents" value={store.incidents.length} change={`${store.incidents.filter((i) => i.status !== 'Closed').length} active`} trend="neutral" />
        <StatCard label="Policies" value={store.policies.length} change="Managed" trend="neutral" />
      </div>

      <CrudTable
        headers={['Event', 'Module', 'User', 'Timestamp']}
        rows={store.activities.map((a) => [a.action, a.module, a.user, formatDateShort(a.createdAt)])}
      />
    </div>
  );
}
