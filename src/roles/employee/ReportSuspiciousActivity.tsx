import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import {
  CrudTable,
  Field,
  FormActions,
  SelectInput,
  StatusBadge,
  TextArea,
  TextInput,
} from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Status, SuspiciousActivity, SuspiciousReport } from '@/types/entities';
import { formatDate } from '@/lib/storage';

const reportDefaults = {
  activityType: 'Suspicious Email',
  description: '',
  observedAt: '',
  userOrSystem: '',
  riskScore: 50,
};

export function ReportSuspiciousActivity() {
  const reports = useCollection('suspiciousReports');
  const activities = useCollection('suspiciousActivities');
  const { currentUserEmail, logActivity, showToast } = useData();

  const [form, setForm] = useState(reportDefaults);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const observedAt = form.observedAt || new Date().toISOString();
    const status: Status = 'Open';

    reports.create({
      activityType: form.activityType,
      description: form.description,
      observedAt,
      reportedBy: currentUserEmail,
      status,
    } satisfies Omit<SuspiciousReport, 'id' | 'createdAt' | 'updatedAt'>);

    activities.create({
      description: form.description,
      userOrSystem: form.userOrSystem || currentUserEmail,
      riskScore: form.riskScore,
      status,
    } satisfies Omit<SuspiciousActivity, 'id' | 'createdAt' | 'updatedAt'>);

    logActivity(`Submitted suspicious activity report: ${form.activityType}`, 'Suspicious Activity');
    showToast('Suspicious activity report submitted and saved');
    setForm(reportDefaults);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Report Suspicious Activity"
        description="Report suspicious emails, links, files, or behavior. Submissions are saved successfully."
        actions={
          <button type="submit" form="suspicious-activity-form" className="btn-primary">
            Submit Report
          </button>
        }
      />

      <div className="card mb-6">
        <form id="suspicious-activity-form" className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Activity Type">
            <SelectInput
              required
              value={form.activityType}
              onChange={(e) => setForm((prev) => ({ ...prev, activityType: e.target.value }))}
            >
              <option>Suspicious Email</option>
              <option>Phishing Attempt</option>
              <option>Unknown Device/Login</option>
              <option>Suspicious File/Link</option>
              <option>Other</option>
            </SelectInput>
          </Field>

          <Field label="Description">
            <TextArea
              required
              rows={4}
              value={form.description}
              placeholder="Describe what you observed..."
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </Field>

          <Field label="Date & Time Observed">
            <TextInput
              type="datetime-local"
              value={form.observedAt}
              onChange={(e) => setForm((prev) => ({ ...prev, observedAt: e.target.value }))}
            />
          </Field>

          <Field label="User or System Involved">
            <TextInput
              value={form.userOrSystem}
              placeholder="e.g. user@company.com or device hostname"
              onChange={(e) => setForm((prev) => ({ ...prev, userOrSystem: e.target.value }))}
            />
          </Field>

          <Field label="Risk Score (1-100)">
            <TextInput
              type="number"
              min={1}
              max={100}
              value={form.riskScore}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  riskScore: Number(e.target.value || 0),
                }))
              }
            />
          </Field>

          <FormActions
            onCancel={() => setForm(reportDefaults)}
            submitLabel="Submit Suspicious Activity"
          />
        </form>
      </div>

      <CrudTable
        headers={['Activity Type', 'Description', 'Observed At', 'Status']}
        rows={reports.items.map((report) => [
          report.activityType,
          report.description,
          formatDate(report.observedAt),
          <StatusBadge key={report.id} status={report.status} />,
        ])}
      />
    </div>
  );
}
