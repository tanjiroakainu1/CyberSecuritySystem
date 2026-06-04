import { FormEvent, useState } from 'react';
import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import {
  CrudTable,
  Modal,
  Field,
  TextInput,
  SelectInput,
  FormActions,
  StatusBadge,
} from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Incident, Severity, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<Incident, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  description: '',
  severity: 'Medium',
  status: 'Open',
  phase: 'Recovery',
  category: 'General',
  affectedAssets: '',
  assignedTo: 'Lisa Officer',
  reportedBy: 'tom@company.com',
  source: 'employee',
});

export function IncidentResolution() {
  const { items, create, update, remove } = useCollection('incidents');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Incident | null>(null);
  const [form, setForm] = useState(emptyForm());
  const incidents = items as Incident[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const incident = items[index] as Incident;
    setEditing(incident);
    setForm({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
      phase: incident.phase,
      category: incident.category,
      affectedAssets: incident.affectedAssets,
      assignedTo: incident.assignedTo,
      reportedBy: incident.reportedBy,
      source: incident.source,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated incident resolution: ${form.title} (${form.status})`, 'Incident Resolution');
      showToast('Incident resolution updated');
    } else {
      create(form);
      logActivity(`Created incident for resolution: ${form.title}`, 'Incident Resolution');
      showToast('Incident created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const incident = items[index] as Incident;
    if (!confirm('Delete this incident?')) return;
    remove(incident.id);
    logActivity(`Deleted incident: ${incident.title}`, 'Incident Resolution');
    showToast('Incident deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Incident Resolution Monitoring"
        description="Update incident status through Resolved and Closed using the shared incidents collection."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Incident
          </button>
        }
      />

      <div className="grid-cards-3">
        <StatCard
          label="Open Incidents"
          value={incidents.filter((incident) => incident.status === 'Open').length}
          change="Awaiting action"
          trend="down"
        />
        <StatCard
          label="Resolved"
          value={incidents.filter((incident) => incident.status === 'Resolved').length}
          change="Ready for closure"
          trend="up"
        />
        <StatCard
          label="Closed"
          value={incidents.filter((incident) => incident.status === 'Closed').length}
          change="Completed lifecycle"
          trend="up"
        />
      </div>

      <CrudTable
        headers={['Title', 'Severity', 'Status', 'Phase', 'Assigned', 'Updated']}
        rows={incidents.map((incident) => [
          incident.title,
          <StatusBadge key={incident.id} status={incident.severity} />,
          <StatusBadge key={`status-${incident.id}`} status={incident.status} />,
          incident.phase,
          incident.assignedTo,
          formatDateShort(incident.updatedAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Update Incident Resolution' : 'Create Incident'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Title">
              <TextInput
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <TextInput
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <Field label="Severity">
              <SelectInput
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}
              >
                {['Low', 'Medium', 'High', 'Critical'].map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Phase">
              <TextInput
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: e.target.value })}
              />
            </Field>
            <Field label="Assigned To">
              <TextInput
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              />
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
