import { FormEvent, useState } from 'react';
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
import { IRReport, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<IRReport, 'id' | 'createdAt' | 'updatedAt'> => ({
  incidentId: '',
  title: '',
  type: 'Initial Report',
  author: 'Lisa Officer',
  status: 'Draft',
});

export function IncidentReports() {
  const { items, create, update, remove } = useCollection('irReports');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IRReport | null>(null);
  const [form, setForm] = useState(emptyForm());
  const reports = items as IRReport[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const report = items[index] as IRReport;
    setEditing(report);
    setForm({
      incidentId: report.incidentId,
      title: report.title,
      type: report.type,
      author: report.author,
      status: report.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated incident report: ${form.title}`, 'Incident Reports');
      showToast('Incident report updated');
    } else {
      create(form);
      logActivity(`Created incident report: ${form.title}`, 'Incident Reports');
      showToast('Incident report created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const report = items[index] as IRReport;
    if (!confirm('Delete this incident report?')) return;
    remove(report.id);
    logActivity(`Deleted incident report: ${report.title}`, 'Incident Reports');
    showToast('Incident report deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Incident Reports"
        description="Create, review, and distribute incident reports to stakeholders."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Report
          </button>
        }
      />

      <CrudTable
        headers={['Incident ID', 'Title', 'Type', 'Author', 'Status', 'Created']}
        rows={reports.map((report) => [
          report.incidentId,
          report.title,
          report.type,
          report.author,
          <StatusBadge key={`status-${report.id}`} status={report.status} />,
          formatDateShort(report.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Incident Report' : 'Create Incident Report'}
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
            <Field label="Type">
              <TextInput
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </Field>
            <Field label="Author">
              <TextInput
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {['Draft', 'In Progress', 'Completed', 'Active'].map((status) => (
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
