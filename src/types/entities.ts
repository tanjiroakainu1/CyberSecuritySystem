import { RoleId } from './roles';

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Active' | 'Inactive' | 'Draft' | 'Pending' | 'Completed' | 'Open' | 'Closed' | 'In Progress' | 'Resolved';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  role: string;
  roleId: RoleId;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface Policy extends BaseEntity {
  name: string;
  category: string;
  status: Status;
  owner: string;
  enforcement?: string;
  acknowledgment?: string;
  compliance?: string;
  version?: string;
}

export interface Activity extends BaseEntity {
  action: string;
  user: string;
  module: string;
  severity?: Severity;
}

export interface Report extends BaseEntity {
  name: string;
  type: string;
  generatedBy: string;
  status: Status;
  period?: string;
}

export interface Backup extends BaseEntity {
  backupId: string;
  backupType: string;
  size: string;
  status: Status;
}

export interface Operation extends BaseEntity {
  name: string;
  status: Status;
  lastCheck: string;
  alerts: number;
  responsible: string;
}

export interface RiskAssessment extends BaseEntity {
  name: string;
  riskLevel: Severity;
  owner: string;
  status: Status;
  dueDate: string;
}

export interface Incident extends BaseEntity {
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  phase: string;
  category: string;
  affectedAssets: string;
  assignedTo: string;
  reportedBy: string;
  source: string;
}

export interface MitigationPlan extends BaseEntity {
  title: string;
  riskAddressed: string;
  submittedBy: string;
  status: Status;
  priority: Severity;
}

export interface ComplianceFramework extends BaseEntity {
  name: string;
  compliance: string;
  lastAudit: string;
  findings: number;
  status: Status;
}

export interface SecurityAlert extends BaseEntity {
  description: string;
  severity: Severity;
  status: Status;
  assigned: string;
  source: string;
}

export interface Threat extends BaseEntity {
  name: string;
  type: string;
  cvssScore: number;
  affectedSystems: string;
  status: Status;
}

export interface SuspiciousActivity extends BaseEntity {
  description: string;
  userOrSystem: string;
  riskScore: number;
  status: Status;
}

export interface RiskItem extends BaseEntity {
  asset: string;
  threat: string;
  likelihood: string;
  impact: string;
  score: number;
  status: Status;
}

export interface IncidentRecord extends BaseEntity {
  incidentId: string;
  title: string;
  category: string;
  analyst: string;
  status: Status;
}

export interface ThreatIntelReport extends BaseEntity {
  title: string;
  threatActor: string;
  confidence: string;
  status: Status;
}

export interface Recommendation extends BaseEntity {
  title: string;
  priority: Severity;
  category: string;
  status: Status;
}

export interface Investigation extends BaseEntity {
  incidentId: string;
  title: string;
  leadInvestigator: string;
  progress: number;
  evidenceItems: number;
}

export interface ResponseAction extends BaseEntity {
  incidentId: string;
  action: string;
  assignedTo: string;
  status: Status;
  due: string;
}

export interface IncidentFinding extends BaseEntity {
  incidentId: string;
  finding: string;
  rootCause: string;
  severity: Severity;
}

export interface IRReport extends BaseEntity {
  incidentId: string;
  title: string;
  type: string;
  author: string;
  status: Status;
}

export interface RecoveryTask extends BaseEntity {
  incidentId: string;
  action: string;
  system: string;
  status: Status;
  owner: string;
}

export interface SuspiciousReport extends BaseEntity {
  activityType: string;
  description: string;
  observedAt: string;
  reportedBy: string;
  status: Status;
}

export interface SecurityConcern extends BaseEntity {
  category: string;
  concern: string;
  status: Status;
  response: string;
  submittedBy: string;
}

export interface TrainingModule extends BaseEntity {
  name: string;
  topic: string;
  duration: string;
  status: Status;
  score: string;
  completedAt: string;
}

export interface Notification extends BaseEntity {
  title: string;
  type: string;
  priority: Severity;
  read: boolean;
}

export interface SystemSetting extends BaseEntity {
  key: string;
  label: string;
  value: string;
  category: string;
}

export interface CredentialSettings {
  passwordLastChanged: string;
  mfaEnabled: boolean;
  activeSessions: number;
  lastLogin: string;
  securityQuestionsConfigured: boolean;
}

export interface AppStore {
  users: User[];
  policies: Policy[];
  activities: Activity[];
  reports: Report[];
  backups: Backup[];
  operations: Operation[];
  riskAssessments: RiskAssessment[];
  incidents: Incident[];
  mitigationPlans: MitigationPlan[];
  complianceFrameworks: ComplianceFramework[];
  alerts: SecurityAlert[];
  threats: Threat[];
  suspiciousActivities: SuspiciousActivity[];
  riskItems: RiskItem[];
  incidentRecords: IncidentRecord[];
  threatIntelReports: ThreatIntelReport[];
  recommendations: Recommendation[];
  investigations: Investigation[];
  responseActions: ResponseAction[];
  findings: IncidentFinding[];
  irReports: IRReport[];
  recoveryTasks: RecoveryTask[];
  suspiciousReports: SuspiciousReport[];
  securityConcerns: SecurityConcern[];
  trainingModules: TrainingModule[];
  notifications: Notification[];
  systemSettings: SystemSetting[];
  credentials: CredentialSettings;
  policyAcknowledgments: Record<string, boolean>;
}

export type CollectionKey = {
  [K in keyof AppStore]: AppStore[K] extends Array<infer U> ? (U extends BaseEntity ? K : never) : never;
}[keyof AppStore];
