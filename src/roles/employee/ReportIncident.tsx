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
import { Incident, Severity, Status } from '@/types/entities';
import { formatDate } from '@/lib/storage';

const incidentDefaults = {
  title: '',
  description: '',
  severity: 'Medium' as Severity,
  category: 'General',
  affectedAssets: '',
};

export function ReportIncident() {
  const incidents = useCollection('incidents');
  const { currentUserEmail, logActivity, showToast } = useData();

  const [form, setForm] = useState(incidentDefaults);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    incidents.create({
      title: form.title,
      description: form.description,
      severity: form.severity,
      status: 'Open' as Status,
      phase: 'Triage',
      category: form.category,
      affectedAssets: form.affectedAssets,
      assignedTo: 'Unassigned',
      reportedBy: currentUserEmail,
      source: 'employee',
    } satisfies Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>);

    logActivity(`Incident reported by employee: ${form.title}`, 'Incident Reporting');
    showToast('Incident submitted and visible to other roles');
    setForm(incidentDefaults);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Report Security Incident"
        description="Submit a formal security incident report. Saved incidents are shared with other roles."
        actions={
          <button type="submit" form="incident-report-form" className="btn-primary">
            Submit Incident
          </button>
        }
      />

      <div className="card mb-6">
        <form id="incident-report-form" className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Incident Title">
            <TextInput
              required
              value={form.title}
              placeholder="Brief title of the incident"
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </Field>

          <Field label="Severity">
            <SelectInput
              value={form.severity}
              onChange={(e) => setForm((prev) => ({ ...prev, severity: e.target.value as Severity }))}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </SelectInput>
          </Field>

          <Field label="Category">
            <SelectInput
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option>General</option>
              <option>Phishing</option>
              <option>Malware</option>
              <option>Unauthorized Access</option>
              <option>Data Exposure</option>
              <option>Insider Threat</option>
            </SelectInput>
          </Field>

          <Field label="Incident Description">
            <TextArea
              required
              rows={5}
              value={form.description}
              placeholder="Provide detailed information about the incident..."
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </Field>

          <Field label="Systems/Affected Assets">
            <TextInput
              value={form.affectedAssets}
              placeholder="e.g., Laptop, Email, VPN"
              onChange={(e) => setForm((prev) => ({ ...prev, affectedAssets: e.target.value }))}
            />
          </Field>

          <FormActions onCancel={() => setForm(incidentDefaults)} submitLabel="Submit Incident" />
        </form>
      </div>

      <CrudTable
        headers={['Title', 'Severity', 'Status', 'Phase', 'Submitted']}
        rows={incidents.items.map((incident) => [
          incident.title,
          <StatusBadge key={incident.id} status={incident.severity} />,
          <StatusBadge key={`status-${incident.id}`} status={incident.status} />,
          incident.phase,
          formatDate(incident.createdAt),
        ])}
      />
    </div>
  );
}
