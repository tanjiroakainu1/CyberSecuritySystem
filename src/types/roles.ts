export type RoleId =
  | 'super-admin'
  | 'security-manager'
  | 'security-analyst'
  | 'incident-response-officer'
  | 'employee';

export interface NavItem {
  label: string;
  path: string;
}

export interface RoleConfig {
  id: RoleId;
  name: string;
  description: string;
  basePath: string;
  dashboardPath: string;
  color: string;
  navItems: NavItem[];
}

export const ROLES: Record<RoleId, RoleConfig> = {
  'super-admin': {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access and administration',
    basePath: '/super-admin',
    dashboardPath: '/super-admin',
    color: 'from-purple-600 to-indigo-700',
    navItems: [
      { label: 'Dashboard', path: '/super-admin' },
      { label: 'Users & Roles', path: '/super-admin/users-roles' },
      { label: 'Security Policies', path: '/super-admin/security-policies' },
      { label: 'System Settings', path: '/super-admin/system-settings' },
      { label: 'Activities', path: '/super-admin/cybersecurity-activities' },
      { label: 'Reports', path: '/super-admin/system-reports' },
      { label: 'Backup & Restore', path: '/super-admin/backup-restore' },
    ],
  },
  'security-manager': {
    id: 'security-manager',
    name: 'Security Manager',
    description: 'Monitor operations and enforce security policies',
    basePath: '/security-manager',
    dashboardPath: '/security-manager',
    color: 'from-cyber-600 to-cyber-700',
    navItems: [
      { label: 'Dashboard', path: '/security-manager' },
      { label: 'Operations', path: '/security-manager/monitor-operations' },
      { label: 'Policies', path: '/security-manager/security-policies' },
      { label: 'Risk Assessments', path: '/security-manager/risk-assessments' },
      { label: 'Incidents', path: '/security-manager/security-incidents' },
      { label: 'Mitigation Plans', path: '/security-manager/mitigation-plans' },
      { label: 'Reports', path: '/security-manager/security-reports' },
      { label: 'Compliance', path: '/security-manager/compliance-status' },
    ],
  },
  'security-analyst': {
    id: 'security-analyst',
    name: 'Security Analyst',
    description: 'Analyze threats and investigate suspicious activities',
    basePath: '/security-analyst',
    dashboardPath: '/security-analyst',
    color: 'from-emerald-600 to-teal-700',
    navItems: [
      { label: 'Dashboard', path: '/security-analyst' },
      { label: 'Alerts', path: '/security-analyst/security-alerts' },
      { label: 'Threat Analysis', path: '/security-analyst/threat-analysis' },
      { label: 'Suspicious Activity', path: '/security-analyst/suspicious-activities' },
      { label: 'Risk Analysis', path: '/security-analyst/risk-analysis' },
      { label: 'Incidents', path: '/security-analyst/incident-records' },
      { label: 'Threat Intel', path: '/security-analyst/threat-intelligence' },
      { label: 'Recommendations', path: '/security-analyst/security-recommendations' },
    ],
  },
  'incident-response-officer': {
    id: 'incident-response-officer',
    name: 'Incident Response Officer',
    description: 'Handle and coordinate cybersecurity incidents',
    basePath: '/incident-response-officer',
    dashboardPath: '/incident-response-officer',
    color: 'from-orange-600 to-red-700',
    navItems: [
      { label: 'Dashboard', path: '/incident-response-officer' },
      { label: 'Handle Incidents', path: '/incident-response-officer/handle-incidents' },
      { label: 'Investigations', path: '/incident-response-officer/investigation-tracking' },
      { label: 'Response Actions', path: '/incident-response-officer/response-actions' },
      { label: 'Findings', path: '/incident-response-officer/incident-findings' },
      { label: 'Resolution', path: '/incident-response-officer/incident-resolution' },
      { label: 'Reports', path: '/incident-response-officer/incident-reports' },
      { label: 'Recovery', path: '/incident-response-officer/recovery-activities' },
    ],
  },
  employee: {
    id: 'employee',
    name: 'Employee / End User',
    description: 'Report incidents and complete security training',
    basePath: '/employee',
    dashboardPath: '/employee',
    color: 'from-slate-600 to-slate-800',
    navItems: [
      { label: 'Dashboard', path: '/employee' },
      { label: 'Report Activity', path: '/employee/report-suspicious-activity' },
      { label: 'Report Incident', path: '/employee/report-incident' },
      { label: 'Security Concerns', path: '/employee/security-concerns' },
      { label: 'Policies', path: '/employee/cybersecurity-policies' },
      { label: 'Training', path: '/employee/security-training' },
      { label: 'Notifications', path: '/employee/security-notifications' },
      { label: 'Credentials', path: '/employee/account-credentials' },
    ],
  },
};

export const ROLE_LIST: RoleConfig[] = Object.values(ROLES);
