import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleLayout } from '@/components/layout/RoleLayout';
import { ProtectedRoute, GuestRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/types/roles';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

import {
  SuperAdminDashboard,
  UsersRoles,
  SecurityPoliciesAdmin,
  SystemSettings,
  CybersecurityActivities,
  SystemReports,
  BackupRestore,
} from '@/roles/super-admin';

import {
  SecurityManagerDashboard,
  MonitorOperations,
  SecurityPoliciesManager,
  RiskAssessments,
  SecurityIncidentsManager,
  MitigationPlans,
  SecurityReportsManager,
  ComplianceStatus,
} from '@/roles/security-manager';

import {
  SecurityAnalystDashboard,
  SecurityAlerts,
  ThreatAnalysis,
  SuspiciousActivities,
  RiskAnalysis,
  IncidentRecords,
  ThreatIntelligence,
  SecurityRecommendations,
} from '@/roles/security-analyst';

import {
  IncidentResponseDashboard,
  HandleIncidents,
  InvestigationTracking,
  ResponseActions,
  IncidentFindings,
  IncidentResolution,
  IncidentReports,
  RecoveryActivities,
} from '@/roles/incident-response-officer';

import {
  EmployeeDashboard,
  ReportSuspiciousActivity,
  ReportIncident,
  SecurityConcerns,
  CybersecurityPolicies,
  SecurityTraining,
  SecurityNotifications,
  AccountCredentials,
} from '@/roles/employee';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRole="super-admin">
            <RoleLayout role={ROLES['super-admin']} />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="users-roles" element={<UsersRoles />} />
        <Route path="security-policies" element={<SecurityPoliciesAdmin />} />
        <Route path="system-settings" element={<SystemSettings />} />
        <Route path="cybersecurity-activities" element={<CybersecurityActivities />} />
        <Route path="system-reports" element={<SystemReports />} />
        <Route path="backup-restore" element={<BackupRestore />} />
      </Route>

      <Route
        path="/security-manager"
        element={
          <ProtectedRoute allowedRole="security-manager">
            <RoleLayout role={ROLES['security-manager']} />
          </ProtectedRoute>
        }
      >
        <Route index element={<SecurityManagerDashboard />} />
        <Route path="monitor-operations" element={<MonitorOperations />} />
        <Route path="security-policies" element={<SecurityPoliciesManager />} />
        <Route path="risk-assessments" element={<RiskAssessments />} />
        <Route path="security-incidents" element={<SecurityIncidentsManager />} />
        <Route path="mitigation-plans" element={<MitigationPlans />} />
        <Route path="security-reports" element={<SecurityReportsManager />} />
        <Route path="compliance-status" element={<ComplianceStatus />} />
      </Route>

      <Route
        path="/security-analyst"
        element={
          <ProtectedRoute allowedRole="security-analyst">
            <RoleLayout role={ROLES['security-analyst']} />
          </ProtectedRoute>
        }
      >
        <Route index element={<SecurityAnalystDashboard />} />
        <Route path="security-alerts" element={<SecurityAlerts />} />
        <Route path="threat-analysis" element={<ThreatAnalysis />} />
        <Route path="suspicious-activities" element={<SuspiciousActivities />} />
        <Route path="risk-analysis" element={<RiskAnalysis />} />
        <Route path="incident-records" element={<IncidentRecords />} />
        <Route path="threat-intelligence" element={<ThreatIntelligence />} />
        <Route path="security-recommendations" element={<SecurityRecommendations />} />
      </Route>

      <Route
        path="/incident-response-officer"
        element={
          <ProtectedRoute allowedRole="incident-response-officer">
            <RoleLayout role={ROLES['incident-response-officer']} />
          </ProtectedRoute>
        }
      >
        <Route index element={<IncidentResponseDashboard />} />
        <Route path="handle-incidents" element={<HandleIncidents />} />
        <Route path="investigation-tracking" element={<InvestigationTracking />} />
        <Route path="response-actions" element={<ResponseActions />} />
        <Route path="incident-findings" element={<IncidentFindings />} />
        <Route path="incident-resolution" element={<IncidentResolution />} />
        <Route path="incident-reports" element={<IncidentReports />} />
        <Route path="recovery-activities" element={<RecoveryActivities />} />
      </Route>

      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRole="employee">
            <RoleLayout role={ROLES.employee} />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="report-suspicious-activity" element={<ReportSuspiciousActivity />} />
        <Route path="report-incident" element={<ReportIncident />} />
        <Route path="security-concerns" element={<SecurityConcerns />} />
        <Route path="cybersecurity-policies" element={<CybersecurityPolicies />} />
        <Route path="security-training" element={<SecurityTraining />} />
        <Route path="security-notifications" element={<SecurityNotifications />} />
        <Route path="account-credentials" element={<AccountCredentials />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
