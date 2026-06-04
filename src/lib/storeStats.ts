import { AppStore, User } from '@/types/entities';
import { ROLE_LIST, RoleId } from '@/types/roles';
import { STORAGE_KEY } from '@/lib/storage';

export function getActiveUserForRole(users: User[], roleId: RoleId): User | undefined {
  return users.find((u) => u.roleId === roleId && u.status === 'Active');
}

export function getRoleQuickAccessUsers(users: User[]): User[] {
  return ROLE_LIST.map((role) => getActiveUserForRole(users, role.id)).filter(
    (user): user is User => !!user,
  );
}

export function countUniqueRoles(users: User[]): number {
  return new Set(users.filter((u) => u.status === 'Active').map((u) => u.roleId)).size;
}

export function getStoreDataSize(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? '';
    const bytes = new Blob([raw]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } catch {
    return '—';
  }
}

export function countTotalRecords(store: AppStore): number {
  return (
    store.users.length +
    store.policies.length +
    store.activities.length +
    store.reports.length +
    store.backups.length +
    store.operations.length +
    store.riskAssessments.length +
    store.incidents.length +
    store.mitigationPlans.length +
    store.complianceFrameworks.length +
    store.alerts.length +
    store.threats.length +
    store.suspiciousActivities.length +
    store.riskItems.length +
    store.incidentRecords.length +
    store.threatIntelReports.length +
    store.recommendations.length +
    store.investigations.length +
    store.responseActions.length +
    store.findings.length +
    store.irReports.length +
    store.recoveryTasks.length +
    store.suspiciousReports.length +
    store.securityConcerns.length +
    store.trainingModules.length +
    store.notifications.length +
    store.systemSettings.length
  );
}

export function estimateBackupSize(): string {
  return getStoreDataSize();
}
