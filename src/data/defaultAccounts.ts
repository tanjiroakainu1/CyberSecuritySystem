import { RoleId } from '@/types/roles';

export interface DefaultAccount {
  roleId: RoleId;
  email: string;
  password: string;
  name: string;
}

/** Initial default credentials used when seeding the system for the first time */
export const DEFAULT_ACCOUNTS: DefaultAccount[] = [
  { roleId: 'super-admin', email: 'john@company.com', password: 'admin123', name: 'John Admin' },
  { roleId: 'security-manager', email: 'sarah@company.com', password: 'manager123', name: 'Sarah Manager' },
  { roleId: 'security-analyst', email: 'mike@company.com', password: 'analyst123', name: 'Mike Analyst' },
  { roleId: 'incident-response-officer', email: 'lisa@company.com', password: 'response123', name: 'Lisa Officer' },
  { roleId: 'employee', email: 'tom@company.com', password: 'employee123', name: 'Tom Employee' },
];

export const DEFAULT_PASSWORD = 'password123';
