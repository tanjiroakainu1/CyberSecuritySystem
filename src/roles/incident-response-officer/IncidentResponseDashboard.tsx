import { PageHeader, StatCard, FeatureCard } from '@/components/ui/PageComponents';
import { CrudTable, StatusBadge } from '@/components/ui/CrudComponents';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { formatDateShort } from '@/lib/storage';

export function IncidentResponseDashboard() {
  const { store } = useData();

  return (
    <div className="page-container">
      <PageHeader
        title="Incident Response Dashboard"
        description="Handle cybersecurity incidents, track investigations, and coordinate recovery."
      />

      <div className="grid-stats">
        <StatCard
          label="Active Incidents"
          value={store.incidents.filter((i) => !['Resolved', 'Closed'].includes(i.status)).length}
          change={`${store.incidents.filter((i) => i.severity === 'Critical').length} critical`}
          trend="down"
        />
        <StatCard
          label="Investigations"
          value={store.investigations.length}
          change={`${store.investigations.filter((i) => i.progress < 100).length} in progress`}
          trend="neutral"
        />
        <StatCard
          label="Response Actions"
          value={store.responseActions.length}
          change={`${store.responseActions.filter((a) => a.status === 'Completed').length} completed`}
          trend="up"
        />
        <StatCard
          label="Recovery Tasks"
          value={store.recoveryTasks.length}
          change={`${store.recoveryTasks.filter((t) => t.status !== 'Completed').length} pending`}
          trend="neutral"
        />
      </div>

      <div className="grid-features">
        <Link className="feature-card-link" to="/incident-response-officer/handle-incidents">
          <FeatureCard
            title="Handle Incidents"
            description="Respond to and manage active cybersecurity incidents."
            status="warning"
          />
        </Link>
        <Link className="feature-card-link" to="/incident-response-officer/investigation-tracking">
          <FeatureCard
            title="Investigation Tracking"
            description="Track incident investigation progress and findings."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/incident-response-officer/response-actions">
          <FeatureCard
            title="Response Actions"
            description="Manage and execute incident response actions."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/incident-response-officer/incident-findings">
          <FeatureCard
            title="Document Findings"
            description="Document incident findings and evidence."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/incident-response-officer/incident-reports">
          <FeatureCard
            title="Incident Reports"
            description="Create and publish incident reports."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/incident-response-officer/recovery-activities">
          <FeatureCard
            title="Recovery Activities"
            description="Coordinate system recovery and restoration."
            status="active"
          />
        </Link>
      </div>

      <h2 className="section-title mb-4">Priority Incidents</h2>
      <CrudTable
        headers={['Title', 'Severity', 'Status', 'Phase', 'Assigned', 'Started']}
        rows={store.incidents.slice(0, 8).map((incident) => [
          incident.title,
          <StatusBadge key={incident.id} status={incident.severity} />,
          <StatusBadge key={`status-${incident.id}`} status={incident.status} />,
          incident.phase,
          incident.assignedTo,
          formatDateShort(incident.createdAt),
        ])}
      />
    </div>
  );
}
