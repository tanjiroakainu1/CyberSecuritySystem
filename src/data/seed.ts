import { DEFAULT_ACCOUNTS } from '@/data/defaultAccounts';

const now = new Date().toISOString();
const ts = (d: string) => new Date(d).toISOString();

const seedPassword = (email: string) =>
  DEFAULT_ACCOUNTS.find((a) => a.email === email)?.password ?? 'password123';

export function createSeedData() {
  return {
    users: [
      { id: 'u1', name: 'John Admin', email: 'john@company.com', password: seedPassword('john@company.com'), role: 'Super Admin', roleId: 'super-admin' as const, status: 'Active' as const, lastLogin: '2026-06-04T09:00:00', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'u2', name: 'Sarah Manager', email: 'sarah@company.com', password: seedPassword('sarah@company.com'), role: 'Security Manager', roleId: 'security-manager' as const, status: 'Active' as const, lastLogin: '2026-06-04T08:45:00', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'u3', name: 'Mike Analyst', email: 'mike@company.com', password: seedPassword('mike@company.com'), role: 'Security Analyst', roleId: 'security-analyst' as const, status: 'Active' as const, lastLogin: '2026-06-03T17:20:00', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'u4', name: 'Lisa Officer', email: 'lisa@company.com', password: seedPassword('lisa@company.com'), role: 'Incident Response Officer', roleId: 'incident-response-officer' as const, status: 'Active' as const, lastLogin: '2026-06-04T07:30:00', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'u5', name: 'Tom Employee', email: 'tom@company.com', password: seedPassword('tom@company.com'), role: 'Employee', roleId: 'employee' as const, status: 'Active' as const, lastLogin: '2026-06-03T14:15:00', createdAt: ts('2026-01-01'), updatedAt: now },
    ],
    policies: [
      { id: 'p1', name: 'Password Policy', category: 'Access Control', status: 'Active' as const, owner: 'Super Admin', enforcement: 'Enforced', acknowledgment: '98%', compliance: 'Compliant', version: 'v3.2', createdAt: ts('2026-05-28'), updatedAt: now },
      { id: 'p2', name: 'Data Encryption Standard', category: 'Data Protection', status: 'Active' as const, owner: 'Security Manager', enforcement: 'Enforced', acknowledgment: '95%', compliance: 'Compliant', version: 'v2.0', createdAt: ts('2026-05-15'), updatedAt: now },
      { id: 'p3', name: 'Incident Response Protocol', category: 'Incident Management', status: 'Active' as const, owner: 'Security Manager', enforcement: 'Enforced', acknowledgment: '92%', compliance: 'At Risk', version: 'v2.0', createdAt: ts('2026-06-01'), updatedAt: now },
      { id: 'p4', name: 'Remote Access Policy', category: 'Network Security', status: 'Draft' as const, owner: 'Super Admin', enforcement: 'Draft', acknowledgment: 'N/A', compliance: 'Pending', version: 'v1.5', createdAt: ts('2026-06-03'), updatedAt: now },
      { id: 'p5', name: 'Acceptable Use Policy', category: 'Compliance', status: 'Active' as const, owner: 'Super Admin', enforcement: 'Enforced', acknowledgment: '96%', compliance: 'Compliant', version: 'v2.1', createdAt: ts('2026-04-20'), updatedAt: now },
    ],
    activities: [
      { id: 'a1', action: 'Policy Updated', user: 'admin@system.com', module: 'Security Policies', severity: 'Low' as const, createdAt: ts('2026-06-04T09:15:00'), updatedAt: ts('2026-06-04T09:15:00') },
      { id: 'a2', action: 'User Created', user: 'admin@system.com', module: 'User Management', severity: 'Low' as const, createdAt: ts('2026-06-04T08:42:00'), updatedAt: ts('2026-06-04T08:42:00') },
      { id: 'a3', action: 'Backup Completed', user: 'system', module: 'Backup & Restore', severity: 'Low' as const, createdAt: ts('2026-06-04T02:00:00'), updatedAt: ts('2026-06-04T02:00:00') },
    ],
    reports: [
      { id: 'r1', name: 'Monthly Security Summary', type: 'Security', generatedBy: 'Super Admin', status: 'Completed' as const, period: 'May 2026', createdAt: ts('2026-06-01'), updatedAt: now },
      { id: 'r2', name: 'Compliance Audit Report', type: 'Compliance', generatedBy: 'Super Admin', status: 'Completed' as const, period: 'Q2 2026', createdAt: ts('2026-05-28'), updatedAt: now },
    ],
    backups: [
      { id: 'b1', backupId: 'BKP-20260604-0200', backupType: 'Full', size: '4.2 GB', status: 'Completed' as const, createdAt: ts('2026-06-04T02:00:00'), updatedAt: ts('2026-06-04T02:00:00') },
      { id: 'b2', backupId: 'BKP-20260603-0200', backupType: 'Full', size: '4.1 GB', status: 'Completed' as const, createdAt: ts('2026-06-03T02:00:00'), updatedAt: ts('2026-06-03T02:00:00') },
    ],
    operations: [
      { id: 'o1', name: 'Firewall Monitoring', status: 'Active' as const, lastCheck: '2026-06-04T09:25:00', alerts: 0, responsible: 'SOC Team', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'o2', name: 'IDS/IPS Analysis', status: 'Active' as const, lastCheck: '2026-06-04T09:24:00', alerts: 2, responsible: 'Mike Analyst', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'o3', name: 'Endpoint Protection', status: 'Active' as const, lastCheck: '2026-06-04T09:23:00', alerts: 1, responsible: 'SOC Team', createdAt: ts('2026-01-01'), updatedAt: now },
    ],
    riskAssessments: [
      { id: 'ra1', name: 'Cloud Infrastructure Review', riskLevel: 'High' as const, owner: 'Mike Analyst', status: 'In Progress' as const, dueDate: '2026-06-10', createdAt: ts('2026-06-01'), updatedAt: now },
      { id: 'ra2', name: 'Third-Party Vendor Audit', riskLevel: 'Medium' as const, owner: 'Sarah Manager', status: 'Completed' as const, dueDate: '2026-06-01', createdAt: ts('2026-05-15'), updatedAt: now },
    ],
    incidents: [
      { id: 'i1', title: 'Phishing Email Campaign', description: 'Multiple users received phishing emails', severity: 'High' as const, status: 'In Progress' as const, phase: 'Containment', category: 'Social Engineering', affectedAssets: 'Email Server', assignedTo: 'Lisa Officer', reportedBy: 'tom@company.com', source: 'employee', createdAt: ts('2026-06-04T08:30:00'), updatedAt: now },
      { id: 'i2', title: 'Unauthorized Access Attempt', description: 'Failed login attempts from external IP', severity: 'Critical' as const, status: 'Open' as const, phase: 'Investigation', category: 'Access Control', affectedAssets: 'Auth Server', assignedTo: 'Lisa Officer', reportedBy: 'system', source: 'system', createdAt: ts('2026-06-03T22:15:00'), updatedAt: now },
      { id: 'i3', title: 'Malware Detection', description: 'Malware detected on endpoint', severity: 'Medium' as const, status: 'Resolved' as const, phase: 'Closed', category: 'Malware', affectedAssets: 'Workstation WS-042', assignedTo: 'Mike Analyst', reportedBy: 'system', source: 'system', createdAt: ts('2026-06-02T10:00:00'), updatedAt: now },
    ],
    mitigationPlans: [
      { id: 'm1', title: 'Network Segmentation', riskAddressed: 'Lateral Movement', submittedBy: 'Mike Analyst', status: 'Pending' as const, priority: 'High' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'm2', title: 'Patch Management Update', riskAddressed: 'Unpatched Systems', submittedBy: 'Mike Analyst', status: 'Completed' as const, priority: 'High' as const, createdAt: ts('2026-06-01'), updatedAt: now },
    ],
    complianceFrameworks: [
      { id: 'c1', name: 'ISO 27001', compliance: '96%', lastAudit: '2026-03-15', findings: 2, status: 'Active' as const, createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'c2', name: 'GDPR', compliance: '98%', lastAudit: '2026-04-01', findings: 1, status: 'Active' as const, createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'c3', name: 'SOC 2 Type II', compliance: '91%', lastAudit: '2026-01-20', findings: 3, status: 'Active' as const, createdAt: ts('2026-01-01'), updatedAt: now },
    ],
    alerts: [
      { id: 'al1', description: 'Multiple failed login attempts from IP 203.0.113.45', severity: 'Critical' as const, status: 'Open' as const, assigned: 'Mike Analyst', source: 'Auth Server', createdAt: ts('2026-06-04T09:20:00'), updatedAt: now },
      { id: 'al2', description: 'Known malware hash detected on endpoint', severity: 'High' as const, status: 'In Progress' as const, assigned: 'Mike Analyst', source: 'Endpoint-042', createdAt: ts('2026-06-04T09:15:00'), updatedAt: now },
      { id: 'al3', description: 'Large outbound data transfer detected', severity: 'Medium' as const, status: 'Open' as const, assigned: 'Unassigned', source: 'Workstation-118', createdAt: ts('2026-06-04T08:55:00'), updatedAt: now },
    ],
    threats: [
      { id: 't1', name: 'SQL Injection', type: 'Web Vulnerability', cvssScore: 9.1, affectedSystems: 'Web App Portal', status: 'Open' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 't2', name: 'Ransomware Variant', type: 'Malware', cvssScore: 8.7, affectedSystems: 'File Server', status: 'Resolved' as const, createdAt: ts('2026-06-03'), updatedAt: now },
    ],
    suspiciousActivities: [
      { id: 'sa1', description: 'After-hours database access', userOrSystem: 'db-admin@internal', riskScore: 85, status: 'In Progress' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'sa2', description: 'Multiple file downloads', userOrSystem: 'tom@company.com', riskScore: 62, status: 'Open' as const, createdAt: ts('2026-06-03'), updatedAt: now },
    ],
    riskItems: [
      { id: 'ri1', asset: 'Customer Database', threat: 'Data Breach', likelihood: 'Medium', impact: 'Critical', score: 8.5, status: 'Open' as const, createdAt: ts('2026-06-01'), updatedAt: now },
      { id: 'ri2', asset: 'Email Server', threat: 'Phishing', likelihood: 'High', impact: 'High', score: 7.8, status: 'In Progress' as const, createdAt: ts('2026-05-28'), updatedAt: now },
    ],
    incidentRecords: [
      { id: 'ir1', incidentId: 'i1', title: 'Phishing Email Campaign', category: 'Social Engineering', analyst: 'Mike Analyst', status: 'In Progress' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'ir2', incidentId: 'i2', title: 'Unauthorized Access Attempt', category: 'Access Control', analyst: 'Mike Analyst', status: 'Open' as const, createdAt: ts('2026-06-03'), updatedAt: now },
    ],
    threatIntelReports: [
      { id: 'ti1', title: 'APT29 Campaign Analysis', threatActor: 'APT29', confidence: 'High', status: 'Completed' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'ti2', title: 'Ransomware Group Activity', threatActor: 'LockBit', confidence: 'Medium', status: 'Completed' as const, createdAt: ts('2026-06-02'), updatedAt: now },
    ],
    recommendations: [
      { id: 'rec1', title: 'Implement network micro-segmentation', priority: 'High' as const, category: 'Network', status: 'Pending' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'rec2', title: 'Enable MFA for all admin accounts', priority: 'Critical' as const, category: 'Access Control', status: 'Completed' as const, createdAt: ts('2026-06-03'), updatedAt: now },
    ],
    investigations: [
      { id: 'inv1', incidentId: 'i1', title: 'Phishing Email Campaign', leadInvestigator: 'Lisa Officer', progress: 65, evidenceItems: 14, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'inv2', incidentId: 'i2', title: 'Unauthorized Access Attempt', leadInvestigator: 'Lisa Officer', progress: 40, evidenceItems: 22, createdAt: ts('2026-06-03'), updatedAt: now },
    ],
    responseActions: [
      { id: 'ra1', incidentId: 'i1', action: 'Block malicious IP range', assignedTo: 'Network Team', status: 'Completed' as const, due: '2026-06-04T09:00:00', createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'ra2', incidentId: 'i1', action: 'Reset affected user credentials', assignedTo: 'IT Support', status: 'In Progress' as const, due: '2026-06-04T10:00:00', createdAt: ts('2026-06-04'), updatedAt: now },
    ],
    findings: [
      { id: 'f1', incidentId: 'i1', finding: 'User clicked phishing link', rootCause: 'Lack of awareness training', severity: 'Medium' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'f2', incidentId: 'i2', finding: 'Weak password policy bypass', rootCause: 'Legacy auth system', severity: 'High' as const, createdAt: ts('2026-06-04'), updatedAt: now },
    ],
    irReports: [
      { id: 'irp1', incidentId: 'i1', title: 'Phishing Email Campaign', type: 'Initial Report', author: 'Lisa Officer', status: 'Draft' as const, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'irp2', incidentId: 'i3', title: 'Malware Detection', type: 'Final Report', author: 'Lisa Officer', status: 'Completed' as const, createdAt: ts('2026-06-02'), updatedAt: now },
    ],
    recoveryTasks: [
      { id: 'rt1', incidentId: 'i1', action: 'Remove malicious emails', system: 'Email Server', status: 'Completed' as const, owner: 'Email Admin', createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'rt2', incidentId: 'i2', action: 'Reset all admin credentials', system: 'Active Directory', status: 'In Progress' as const, owner: 'IT Security', createdAt: ts('2026-06-04'), updatedAt: now },
    ],
    suspiciousReports: [],
    securityConcerns: [
      { id: 'sc1', category: 'Access Control', concern: 'Badge access for server room', status: 'Resolved' as const, response: 'Badge access updated', submittedBy: 'tom@company.com', createdAt: ts('2026-05-20'), updatedAt: now },
    ],
    trainingModules: [
      { id: 'tm1', name: 'Module 1', topic: 'Phishing Awareness', duration: '30 min', status: 'Completed' as const, score: '95%', completedAt: '2026-05-15', createdAt: ts('2026-05-15'), updatedAt: now },
      { id: 'tm2', name: 'Module 2', topic: 'Password Security', duration: '20 min', status: 'Completed' as const, score: '100%', completedAt: '2026-05-20', createdAt: ts('2026-05-20'), updatedAt: now },
      { id: 'tm3', name: 'Module 3', topic: 'Data Protection', duration: '25 min', status: 'Completed' as const, score: '88%', completedAt: '2026-05-28', createdAt: ts('2026-05-28'), updatedAt: now },
      { id: 'tm4', name: 'Module 4', topic: 'Incident Reporting', duration: '15 min', status: 'In Progress' as const, score: '—', completedAt: '', createdAt: ts('2026-06-01'), updatedAt: now },
    ],
    notifications: [
      { id: 'n1', title: 'New Password Policy — Please Review', type: 'Policy Update', priority: 'High' as const, read: false, createdAt: ts('2026-06-04'), updatedAt: now },
      { id: 'n2', title: 'Phishing Awareness Training Due', type: 'Training Reminder', priority: 'Medium' as const, read: false, createdAt: ts('2026-06-03'), updatedAt: now },
      { id: 'n3', title: 'Security Incident Resolved — Malware Detection', type: 'Incident Update', priority: 'Low' as const, read: true, createdAt: ts('2026-06-02'), updatedAt: now },
    ],
    systemSettings: [
      { id: 'ss1', key: 'mfa_required', label: 'Require MFA', value: 'true', category: 'Authentication', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'ss2', key: 'session_timeout', label: 'Session Timeout (minutes)', value: '30', category: 'Authentication', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'ss3', key: 'audit_retention', label: 'Audit Log Retention (days)', value: '365', category: 'Audit', createdAt: ts('2026-01-01'), updatedAt: now },
      { id: 'ss4', key: 'backup_schedule', label: 'Backup Schedule', value: 'Daily at 2:00 AM', category: 'Backup', createdAt: ts('2026-01-01'), updatedAt: now },
    ],
    credentials: {
      passwordLastChanged: '2026-04-20',
      mfaEnabled: true,
      activeSessions: 2,
      lastLogin: '2026-06-04T08:30:00',
      securityQuestionsConfigured: true,
    },
    policyAcknowledgments: { p1: true, p2: true, p3: true, p5: true },
  };
}
