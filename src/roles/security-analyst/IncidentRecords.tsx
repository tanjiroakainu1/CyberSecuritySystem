import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageComponents';
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
import { IncidentRecord, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<IncidentRecord, 'id' | 'createdAt' | 'updatedAt'> => ({
  incidentId: '',
  title: '',
  category: '',
  analyst: 'Mike Analyst',
  status: 'Open',
});

export function IncidentRecords() {
  const { items, create, update, remove } = useCollection('incidentRecords');
  const { store, logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IncidentRecord | null>(null);
  const [form, setForm] = useState(emptyForm());
  const records = items as IncidentRecord[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const record = items[index] as IncidentRecord;
    setEditing(record);
    setForm({
      incidentId: record.incidentId,
      title: record.title,
      category: record.category,
      analyst: record.analyst,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated incident record: ${form.title}`, 'Incident Records');
      showToast('Incident record updated');
    } else {
      create(form);
      logActivity(`Created incident record: ${form.title}`, 'Incident Records');
      showToast('Incident record created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const record = items[index] as IncidentRecord;
    if (!confirm('Delete this incident record?')) return;
    remove(record.id);
    logActivity(`Deleted incident record: ${record.title}`, 'Incident Records');
    showToast('Incident record deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Incident Records Management"
        description="Manage incident records and review shared incidents from the response workflow."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Record
          </button>
        }
      />

      <CrudTable
        headers={['Incident ID', 'Title', 'Category', 'Analyst', 'Status', 'Updated']}
        rows={records.map((record) => [
          record.incidentId,
          record.title,
          record.category,
          record.analyst,
          <StatusBadge key={`status-${record.id}`} status={record.status} />,
          formatDateShort(record.updatedAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <h2 className="section-title mb-4 mt-8">Shared Incidents (Read-only)</h2>
      <p className="mb-4 text-sm text-slate-600">
        These incidents come from the common `incidents` collection. IR officers and employees work on
        the same data.
      </p>
      <CrudTable
        headers={['Title', 'Severity', 'Status', 'Phase', 'Assigned', 'Reported']}
        rows={store.incidents.slice(0, 8).map((incident) => [
          incident.title,
          <StatusBadge key={incident.id} status={incident.severity} />,
          <StatusBadge key={`incident-status-${incident.id}`} status={incident.status} />,
          incident.phase,
          incident.assignedTo,
          formatDateShort(incident.createdAt),
        ])}
      />
      <div className="mt-4">
        <Link className="text-sm font-medium text-cyber-700 hover:text-cyber-900" to="/incident-response-officer/handle-incidents">
          Open Incident Response queue
        </Link>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Incident Record' : 'Create Incident Record'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Incident ID">
              <TextInput
                required
                value={form.incidentId}
                onChange={(e) => setForm({ ...form, incidentId: e.target.value })}
              />
            </Field>
            <Field label="Title">
              <TextInput
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <TextInput
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
            <Field label="Analyst">
              <TextInput
                value={form.analyst}
                onChange={(e) => setForm({ ...form, analyst: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {['Open', 'In Progress', 'Resolved', 'Closed', 'Active'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
