import { PageHeader, StatCard, FeatureCard } from '@/components/ui/PageComponents';
import { CrudTable, StatusBadge } from '@/components/ui/CrudComponents';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';

export function SecurityManagerDashboard() {
  const { store } = useData();

  return (
    <div className="page-container">
      <PageHeader title="Security Manager Dashboard" description="Monitor operations, policies, risk, and compliance across the organization." />

      <div className="grid-stats">
        <StatCard label="Open Incidents" value={store.incidents.filter((i) => !['Closed', 'Resolved'].includes(i.status)).length} change={`${store.incidents.filter((i) => i.severity === 'Critical').length} critical`} trend="down" />
        <StatCard label="Active Policies" value={store.policies.filter((p) => p.status === 'Active').length} change={`${store.policies.filter((p) => p.status === 'Draft').length} draft`} trend="neutral" />
        <StatCard label="Risk Assessments" value={store.riskAssessments.length} change={`${store.riskAssessments.filter((r) => r.status === 'In Progress').length} in progress`} trend="up" />
        <StatCard label="Compliance Frameworks" value={store.complianceFrameworks.length} change={`${store.complianceFrameworks.reduce((s, c) => s + c.findings, 0)} open findings`} trend="up" />
      </div>

      <div className="grid-features">
        <Link className="feature-card-link" to="/security-manager/monitor-operations"><FeatureCard title="Monitor Operations" description="Real-time monitoring of cybersecurity operations." status="active" /></Link>
        <Link className="feature-card-link" to="/security-manager/security-policies"><FeatureCard title="Security Policies" description="Create and enforce security policies." status="active" /></Link>
        <Link className="feature-card-link" to="/security-manager/risk-assessments"><FeatureCard title="Risk Assessments" description="Manage and review risk assessments." status="warning" /></Link>
        <Link className="feature-card-link" to="/security-manager/security-incidents"><FeatureCard title="Security Incidents" description="Review and approve incident handling." status="active" /></Link>
        <Link className="feature-card-link" to="/security-manager/mitigation-plans"><FeatureCard title="Mitigation Plans" description="Approve security mitigation plans." status="active" /></Link>
        <Link className="feature-card-link" to="/security-manager/compliance-status"><FeatureCard title="Compliance Status" description="Monitor regulatory compliance status." status="active" /></Link>
      </div>

      <h2 className="section-title mb-4">Pending Mitigation Plans</h2>
      <CrudTable
        headers={['Title', 'Risk', 'Submitted By', 'Priority', 'Status']}
        rows={store.mitigationPlans.filter((m) => m.status === 'Pending').map((m) => [m.title, m.riskAddressed, m.submittedBy, <StatusBadge key={m.id} status={m.priority} />, <StatusBadge key={`s-${m.id}`} status={m.status} />])}
      />
    </div>
  );
}
