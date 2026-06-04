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
import { IncidentFinding, Severity } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<IncidentFinding, 'id' | 'createdAt' | 'updatedAt'> => ({
  incidentId: '',
  finding: '',
  rootCause: '',
  severity: 'Medium',
});

export function IncidentFindings() {
  const { items, create, update, remove } = useCollection('findings');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IncidentFinding | null>(null);
  const [form, setForm] = useState(emptyForm());
  const findings = items as IncidentFinding[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const finding = items[index] as IncidentFinding;
    setEditing(finding);
    setForm({
      incidentId: finding.incidentId,
      finding: finding.finding,
      rootCause: finding.rootCause,
      severity: finding.severity,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated incident finding: ${form.incidentId}`, 'Incident Findings');
      showToast('Incident finding updated');
    } else {
      create(form);
      logActivity(`Created incident finding: ${form.incidentId}`, 'Incident Findings');
      showToast('Incident finding created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const finding = items[index] as IncidentFinding;
    if (!confirm('Delete this incident finding?')) return;
    remove(finding.id);
    logActivity(`Deleted incident finding: ${finding.incidentId}`, 'Incident Findings');
    showToast('Incident finding deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Incident Findings Documentation"
        description="Document incident findings, root cause analysis, and lessons learned."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Finding
          </button>
        }
      />

      <CrudTable
        headers={['Incident ID', 'Finding', 'Root Cause', 'Severity', 'Documented']}
        rows={findings.map((finding) => [
          finding.incidentId,
          finding.finding,
          finding.rootCause,
          <StatusBadge key={finding.id} status={finding.severity} />,
          formatDateShort(finding.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Incident Finding' : 'Create Incident Finding'}
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
            <Field label="Finding">
              <TextInput
                required
                value={form.finding}
                onChange={(e) => setForm({ ...form, finding: e.target.value })}
              />
            </Field>
            <Field label="Root Cause">
              <TextInput
                required
                value={form.rootCause}
                onChange={(e) => setForm({ ...form, rootCause: e.target.value })}
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
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
