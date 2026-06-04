import { PageHeader, StatCard, FeatureCard } from '@/components/ui/PageComponents';
import { CrudTable, StatusBadge } from '@/components/ui/CrudComponents';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { formatDateShort } from '@/lib/storage';

export function SecurityAnalystDashboard() {
  const { store } = useData();

  return (
    <div className="page-container">
      <PageHeader
        title="Security Analyst Dashboard"
        description="Monitor alerts, analyze threats, and investigate suspicious activities from the system data."
      />

      <div className="grid-stats">
        <StatCard
          label="Active Alerts"
          value={store.alerts.filter((a) => !['Resolved', 'Closed'].includes(a.status)).length}
          change={`${store.alerts.filter((a) => a.severity === 'Critical').length} critical`}
          trend="down"
        />
        <StatCard
          label="Open Threats"
          value={store.threats.filter((t) => !['Resolved', 'Closed'].includes(t.status)).length}
          change={`${store.threats.filter((t) => t.cvssScore >= 8).length} high CVSS`}
          trend="up"
        />
        <StatCard
          label="Suspicious Activities"
          value={store.suspiciousActivities.length}
          change={`${store.suspiciousActivities.filter((s) => s.riskScore >= 80).length} high risk`}
          trend="neutral"
        />
        <StatCard
          label="Threat Intel Reports"
          value={store.threatIntelReports.length}
          change={`${store.threatIntelReports.filter((r) => r.status === 'Draft').length} draft`}
          trend="neutral"
        />
      </div>

      <div className="grid-features">
        <Link className="feature-card-link" to="/security-analyst/security-alerts">
          <FeatureCard
            title="Security Alerts"
            description="Monitor and triage incoming security alerts."
            status="warning"
          />
        </Link>
        <Link className="feature-card-link" to="/security-analyst/threat-analysis">
          <FeatureCard
            title="Threat Analysis"
            description="Analyze threats and vulnerabilities."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/security-analyst/suspicious-activities">
          <FeatureCard
            title="Suspicious Activities"
            description="Investigate suspicious user and system activities."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/security-analyst/risk-analysis">
          <FeatureCard
            title="Risk Analysis"
            description="Perform detailed risk analysis and scoring."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/security-analyst/incident-records">
          <FeatureCard
            title="Incident Records"
            description="Manage records and review shared incidents."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/security-analyst/security-recommendations">
          <FeatureCard
            title="Recommendations"
            description="Recommend security improvements."
            status="active"
          />
        </Link>
      </div>

      <h2 className="section-title mb-4">Recent Alerts</h2>
      <CrudTable
        headers={['Description', 'Severity', 'Status', 'Source', 'Detected']}
        rows={store.alerts
          .slice(0, 8)
          .map((alert) => [
            alert.description,
            <StatusBadge key={alert.id} status={alert.severity} />,
            <StatusBadge key={`status-${alert.id}`} status={alert.status} />,
            alert.source,
            formatDateShort(alert.createdAt),
          ])}
      />
    </div>
  );
}
