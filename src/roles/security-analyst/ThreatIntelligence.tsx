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
import { ThreatIntelReport, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<ThreatIntelReport, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  threatActor: '',
  confidence: 'Medium',
  status: 'Draft',
});

export function ThreatIntelligence() {
  const { items, create, update, remove } = useCollection('threatIntelReports');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ThreatIntelReport | null>(null);
  const [form, setForm] = useState(emptyForm());
  const reports = items as ThreatIntelReport[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const report = items[index] as ThreatIntelReport;
    setEditing(report);
    setForm({
      title: report.title,
      threatActor: report.threatActor,
      confidence: report.confidence,
      status: report.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated threat intel report: ${form.title}`, 'Threat Intelligence');
      showToast('Threat intel report updated');
    } else {
      create(form);
      logActivity(`Created threat intel report: ${form.title}`, 'Threat Intelligence');
      showToast('Threat intel report created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const report = items[index] as ThreatIntelReport;
    if (!confirm('Delete this threat intelligence report?')) return;
    remove(report.id);
    logActivity(`Deleted threat intel report: ${report.title}`, 'Threat Intelligence');
    showToast('Threat intel report deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Threat Intelligence Reports"
        description="Generate and review threat intelligence reports and IOC feeds."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Report
          </button>
        }
      />

      <CrudTable
        headers={['Title', 'Threat Actor', 'Confidence', 'Status', 'Generated']}
        rows={reports.map((report) => [
          report.title,
          report.threatActor,
          report.confidence,
          <StatusBadge key={`status-${report.id}`} status={report.status} />,
          formatDateShort(report.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Threat Intel Report' : 'Create Threat Intel Report'}
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
            <Field label="Threat Actor">
              <TextInput
                required
                value={form.threatActor}
                onChange={(e) => setForm({ ...form, threatActor: e.target.value })}
              />
            </Field>
            <Field label="Confidence">
              <SelectInput
                value={form.confidence}
                onChange={(e) => setForm({ ...form, confidence: e.target.value })}
              >
                {['Low', 'Medium', 'High'].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </SelectInput>
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
