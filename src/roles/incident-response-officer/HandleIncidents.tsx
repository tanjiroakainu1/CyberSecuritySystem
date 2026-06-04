import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import {
  CrudTable,
  Modal,
  Field,
  TextInput,
  SelectInput,
  TextArea,
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
  phase: 'Investigation',
  category: 'General',
  affectedAssets: '',
  assignedTo: 'Lisa Officer',
  reportedBy: 'tom@company.com',
  source: 'employee',
});

export function HandleIncidents() {
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
      logActivity(`Updated incident: ${form.title}`, 'Handle Incidents');
      showToast('Incident updated');
    } else {
      create(form);
      logActivity(`Created incident: ${form.title}`, 'Handle Incidents');
      showToast('Incident created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const incident = items[index] as Incident;
    if (!confirm('Delete this incident?')) return;
    remove(incident.id);
    logActivity(`Deleted incident: ${incident.title}`, 'Handle Incidents');
    showToast('Incident deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Handle Cybersecurity Incidents"
        description="Respond to, contain, and manage active incidents from the shared incidents collection."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Incident
          </button>
        }
      />

      <CrudTable
        headers={['Title', 'Severity', 'Status', 'Phase', 'Assigned To', 'Reported By', 'Started']}
        rows={incidents.map((incident) => [
          incident.title,
          <StatusBadge key={incident.id} status={incident.severity} />,
          <StatusBadge key={`status-${incident.id}`} status={incident.status} />,
          incident.phase,
          incident.assignedTo,
          incident.reportedBy,
          formatDateShort(incident.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Incident' : 'Create Incident'}
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
              <TextArea
                rows={3}
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
            <Field label="Category">
              <TextInput
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
            <Field label="Affected Assets">
              <TextInput
                value={form.affectedAssets}
                onChange={(e) => setForm({ ...form, affectedAssets: e.target.value })}
              />
            </Field>
            <Field label="Assigned To">
              <TextInput
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              />
            </Field>
            <Field label="Reported By">
              <TextInput
                value={form.reportedBy}
                onChange={(e) => setForm({ ...form, reportedBy: e.target.value })}
              />
            </Field>
            <Field label="Source">
              <TextInput
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
