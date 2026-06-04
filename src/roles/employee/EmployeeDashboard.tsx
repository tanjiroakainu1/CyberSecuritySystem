import { Link } from 'react-router-dom';
import { PageHeader, StatCard, FeatureCard } from '@/components/ui/PageComponents';
import { CrudTable } from '@/components/ui/CrudComponents';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/lib/storage';

export function EmployeeDashboard() {
  const { store, currentUserEmail } = useData();

  const completedModules = store.trainingModules.filter((module) => module.status === 'Completed').length;
  const trainingProgress = store.trainingModules.length
    ? Math.round((completedModules / store.trainingModules.length) * 100)
    : 0;

  const acknowledgedPolicies = store.policies.filter(
    (policy) => store.policyAcknowledgments[policy.id],
  ).length;

  const reportCount =
    store.suspiciousReports.filter((report) => report.reportedBy === currentUserEmail).length +
    store.incidents.filter((incident) => incident.reportedBy === currentUserEmail).length +
    store.securityConcerns.filter((concern) => concern.submittedBy === currentUserEmail).length;

  const unreadNotifications = store.notifications.filter((notification) => !notification.read).length;

  const recentNotifications = [...store.notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="page-container">
      <PageHeader
        title="Employee Dashboard"
        description="Track your training, policies, reports, and notifications with live system data."
        actions={
          <Link to="/employee/report-incident" className="btn-primary">
            Report Incident
          </Link>
        }
      />

      <div className="grid-stats">
        <StatCard
          label="Training Progress"
          value={`${trainingProgress}%`}
          change={`${store.trainingModules.length - completedModules} module(s) remaining`}
          trend="up"
        />
        <StatCard
          label="Policies Acknowledged"
          value={`${acknowledgedPolicies}/${store.policies.length}`}
          change={`${store.policies.length - acknowledgedPolicies} pending`}
          trend="neutral"
        />
        <StatCard label="Reports Submitted" value={reportCount} change="Across all employee forms" />
        <StatCard label="Notifications" value={store.notifications.length} change={`${unreadNotifications} unread`} />
      </div>

      <div className="grid-features">
        <Link className="feature-card-link" to="/employee/report-suspicious-activity">
          <FeatureCard
            title="Report Suspicious Activity"
            description="Submit suspicious emails, links, or behavior."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/employee/report-incident">
          <FeatureCard
            title="Report Security Incident"
            description="Create incidents that are visible to other roles."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/employee/security-concerns">
          <FeatureCard
            title="Security Concerns"
            description="Create and manage your security concerns."
            status="active"
          />
        </Link>
        <Link className="feature-card-link" to="/employee/cybersecurity-policies">
          <FeatureCard
            title="Cybersecurity Policies"
            description="Review and acknowledge pending policies."
            status={store.policies.some((policy) => !store.policyAcknowledgments[policy.id]) ? 'warning' : 'active'}
          />
        </Link>
        <Link className="feature-card-link" to="/employee/security-training">
          <FeatureCard
            title="Security Training"
            description="Mark modules complete and track progress."
            status={trainingProgress === 100 ? 'active' : 'warning'}
          />
        </Link>
        <Link className="feature-card-link" to="/employee/security-notifications">
          <FeatureCard
            title="Security Notifications"
            description="Review notifications and mark them read."
            status={unreadNotifications ? 'warning' : 'active'}
          />
        </Link>
      </div>

      <CrudTable
        headers={['Notification', 'Type', 'Date', 'Status']}
        rows={recentNotifications.map((notification) => [
          notification.title,
          notification.type,
          formatDate(notification.createdAt),
          notification.read ? 'Read' : 'Unread',
        ])}
      />
    </div>
  );
}
