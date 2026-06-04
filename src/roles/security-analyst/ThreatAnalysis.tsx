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
import { Threat, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<Threat, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  type: '',
  cvssScore: 0,
  affectedSystems: '',
  status: 'Open',
});

export function ThreatAnalysis() {
  const { items, create, update, remove } = useCollection('threats');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Threat | null>(null);
  const [form, setForm] = useState(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const threat = items[index] as Threat;
    setEditing(threat);
    setForm({
      name: threat.name,
      type: threat.type,
      cvssScore: threat.cvssScore,
      affectedSystems: threat.affectedSystems,
      status: threat.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated threat analysis: ${form.name}`, 'Threat Analysis');
      showToast('Threat updated');
    } else {
      create(form);
      logActivity(`Created threat analysis: ${form.name}`, 'Threat Analysis');
      showToast('Threat created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const threat = items[index] as Threat;
    if (!confirm('Delete this threat entry?')) return;
    remove(threat.id);
    logActivity(`Deleted threat analysis: ${threat.name}`, 'Threat Analysis');
    showToast('Threat deleted');
  };

  const threats = items as Threat[];

  return (
    <div className="page-container">
      <PageHeader
        title="Threat & Vulnerability Analysis"
        description="Analyze threats, vulnerabilities, and emerging attack patterns."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Threat
          </button>
        }
      />

      <CrudTable
        headers={['Name', 'Type', 'CVSS Score', 'Affected Systems', 'Status', 'Discovered']}
        rows={threats.map((threat) => [
          threat.name,
          threat.type,
          threat.cvssScore.toFixed(1),
          threat.affectedSystems,
          <StatusBadge key={`status-${threat.id}`} status={threat.status} />,
          formatDateShort(threat.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Threat' : 'Create Threat'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Threat Name">
              <TextInput
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Type">
              <TextInput
                required
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </Field>
            <Field label="CVSS Score">
              <TextInput
                type="number"
                min={0}
                max={10}
                step={0.1}
                required
                value={form.cvssScore}
                onChange={(e) => setForm({ ...form, cvssScore: Number(e.target.value) })}
              />
            </Field>
            <Field label="Affected Systems">
              <TextInput
                value={form.affectedSystems}
                onChange={(e) => setForm({ ...form, affectedSystems: e.target.value })}
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
