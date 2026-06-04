import { RoleId } from '@/types/roles';

export interface RoleFeature {
  title: string;
  description: string;
}

export interface RoleFlow {
  roleId: RoleId;
  features: RoleFeature[];
  workflow: string[];
}

export interface SystemModule {
  name: string;
  description: string;
  roles: RoleId[];
}

export const SYSTEM_FLOW_STEPS = [
  {
    step: 1,
    title: 'Register or Login',
    description: 'Create an account or sign in with your assigned role credentials.',
  },
  {
    step: 2,
    title: 'Access Role Dashboard',
    description: 'Each role has a dedicated dashboard with stats and quick links to their modules.',
  },
  {
    step: 3,
    title: 'Perform Role Actions',
    description: 'Create, view, update, and manage records within your authorized modules.',
  },
  {
    step: 4,
    title: 'Shared System Data',
    description: 'Actions sync across roles — e.g. employee incident reports appear for managers and IR officers.',
  },
];

export const CROSS_ROLE_FLOW = [
  { from: 'Employee', action: 'Reports incident or suspicious activity', to: 'Security Manager & Analyst' },
  { from: 'Security Analyst', action: 'Triages alerts and creates incident records', to: 'Incident Response Officer' },
  { from: 'Incident Response Officer', action: 'Handles investigation and recovery', to: 'Security Manager' },
  { from: 'Security Manager', action: 'Approves mitigation plans and policies', to: 'Super Admin' },
  { from: 'Super Admin', action: 'Manages users, settings, and system-wide reports', to: 'All Roles' },
];

export const SYSTEM_MODULES: SystemModule[] = [
  { name: 'User & Access Management', description: 'Registration, login, role-based access, and user administration.', roles: ['super-admin'] },
  { name: 'Security Monitoring', description: 'Real-time operations monitoring, alerts, and log tracking.', roles: ['security-manager', 'security-analyst'] },
  { name: 'Incident Management', description: 'Report, investigate, respond to, and resolve security incidents.', roles: ['employee', 'security-manager', 'security-analyst', 'incident-response-officer'] },
  { name: 'Vulnerability Management', description: 'Threat analysis, vulnerability tracking, and remediation.', roles: ['security-analyst'] },
  { name: 'Risk Management', description: 'Risk assessments, scoring, classification, and mitigation tracking.', roles: ['security-manager', 'security-analyst'] },
  { name: 'Security Policy Management', description: 'Policy creation, approval, distribution, and acknowledgment.', roles: ['super-admin', 'security-manager', 'employee'] },
  { name: 'Compliance Management', description: 'Compliance monitoring, audit preparation, and regulatory documentation.', roles: ['security-manager', 'super-admin'] },
  { name: 'Security Awareness & Training', description: 'Training modules, completion tracking, and awareness campaigns.', roles: ['employee'] },
  { name: 'Reports & Analytics', description: 'Security, threat, incident, risk, and compliance reports.', roles: ['super-admin', 'security-manager', 'security-analyst', 'incident-response-officer'] },
  { name: 'System Administration', description: 'System settings, backups, audit logs, and notifications.', roles: ['super-admin'] },
];

export const ROLE_FLOWS: RoleFlow[] = [
  {
    roleId: 'super-admin',
    features: [
      { title: 'Full System Access', description: 'Unrestricted access to all modules and administrative functions.' },
      { title: 'Manage Users & Roles', description: 'Create, edit, and assign roles to all system users.' },
      { title: 'Configure Security Policies', description: 'Create and manage organization-wide security policies.' },
      { title: 'System Settings', description: 'Configure authentication, notifications, audit logs, and integrations.' },
      { title: 'Cybersecurity Activities', description: 'View all logged activities across the entire system.' },
      { title: 'System Reports', description: 'Generate system-wide security and compliance reports.' },
      { title: 'Backup & Restore', description: 'Create data backups and manage restore points.' },
    ],
    workflow: ['Login → Dashboard → Manage Users → Configure Policies → Review Activities → Generate Reports'],
  },
  {
    roleId: 'security-manager',
    features: [
      { title: 'Monitor Operations', description: 'Real-time overview of cybersecurity monitoring activities.' },
      { title: 'Security Policies', description: 'Create, enforce, and distribute security policies.' },
      { title: 'Risk Assessments', description: 'Manage risk assessments, classifications, and tracking.' },
      { title: 'Security Incidents', description: 'Review and oversee incident handling across teams.' },
      { title: 'Mitigation Plans', description: 'Review and approve security mitigation plans.' },
      { title: 'Security Reports', description: 'Generate management and compliance security reports.' },
      { title: 'Compliance Status', description: 'Monitor regulatory compliance and audit readiness.' },
    ],
    workflow: ['Login → Dashboard → Monitor Operations → Review Incidents → Approve Mitigations → Check Compliance'],
  },
  {
    roleId: 'security-analyst',
    features: [
      { title: 'Security Alerts', description: 'Monitor, triage, and respond to security alerts.' },
      { title: 'Threat Analysis', description: 'Analyze threats, vulnerabilities, and attack patterns.' },
      { title: 'Suspicious Activities', description: 'Investigate suspicious user and system behavior.' },
      { title: 'Risk Analysis', description: 'Perform risk scoring and classification.' },
      { title: 'Incident Records', description: 'Manage and document incident investigation records.' },
      { title: 'Threat Intelligence', description: 'Generate and review threat intelligence reports.' },
      { title: 'Recommendations', description: 'Submit security improvement recommendations.' },
    ],
    workflow: ['Login → Dashboard → Triage Alerts → Analyze Threats → Investigate → Document & Recommend'],
  },
  {
    roleId: 'incident-response-officer',
    features: [
      { title: 'Handle Incidents', description: 'Respond to and manage active cybersecurity incidents.' },
      { title: 'Investigation Tracking', description: 'Track investigation progress and evidence collection.' },
      { title: 'Response Actions', description: 'Execute and manage containment and response actions.' },
      { title: 'Document Findings', description: 'Record root cause analysis and incident findings.' },
      { title: 'Incident Resolution', description: 'Monitor resolution progress and verify closure.' },
      { title: 'Incident Reports', description: 'Create and publish incident reports.' },
      { title: 'Recovery Activities', description: 'Coordinate system recovery and restoration.' },
    ],
    workflow: ['Login → Dashboard → Handle Incident → Investigate → Execute Actions → Resolve → Report'],
  },
  {
    roleId: 'employee',
    features: [
      { title: 'Report Suspicious Activity', description: 'Report phishing, unknown logins, or suspicious behavior.' },
      { title: 'Report Security Incident', description: 'Submit formal incident reports for immediate review.' },
      { title: 'Security Concerns', description: 'Submit general security questions or suggestions.' },
      { title: 'Cybersecurity Policies', description: 'View and acknowledge organization security policies.' },
      { title: 'Security Training', description: 'Complete security awareness training modules.' },
      { title: 'Notifications', description: 'Receive and manage security alerts and updates.' },
      { title: 'Account Credentials', description: 'Manage password and multi-factor authentication.' },
    ],
    workflow: ['Login → Dashboard → Report Issues → Acknowledge Policies → Complete Training → Manage Account'],
  },
];

export function getRoleFlow(roleId: RoleId): RoleFlow | undefined {
  return ROLE_FLOWS.find((r) => r.roleId === roleId);
}
