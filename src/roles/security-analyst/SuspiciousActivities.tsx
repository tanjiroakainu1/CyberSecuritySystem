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
import { SuspiciousActivity, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<SuspiciousActivity, 'id' | 'createdAt' | 'updatedAt'> => ({
  description: '',
  userOrSystem: '',
  riskScore: 0,
  status: 'Open',
});

export function SuspiciousActivities() {
  const { items, create, update, remove } = useCollection('suspiciousActivities');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SuspiciousActivity | null>(null);
  const [form, setForm] = useState(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const activity = items[index] as SuspiciousActivity;
    setEditing(activity);
    setForm({
      description: activity.description,
      userOrSystem: activity.userOrSystem,
      riskScore: activity.riskScore,
      status: activity.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated suspicious activity: ${form.description}`, 'Suspicious Activities');
      showToast('Suspicious activity updated');
    } else {
      create(form);
      logActivity(`Created suspicious activity: ${form.description}`, 'Suspicious Activities');
      showToast('Suspicious activity created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const activity = items[index] as SuspiciousActivity;
    if (!confirm('Delete this suspicious activity?')) return;
    remove(activity.id);
    logActivity(`Deleted suspicious activity: ${activity.description}`, 'Suspicious Activities');
    showToast('Suspicious activity deleted');
  };

  const activities = items as SuspiciousActivity[];

  return (
    <div className="page-container">
      <PageHeader
        title="Suspicious Activity Investigation"
        description="Investigate suspicious user behavior and system activities."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Activity
          </button>
        }
      />

      <CrudTable
        headers={['Description', 'User/System', 'Risk Score', 'Status', 'Detected']}
        rows={activities.map((activity) => [
          activity.description,
          activity.userOrSystem,
          activity.riskScore,
          <StatusBadge key={`status-${activity.id}`} status={activity.status} />,
          formatDateShort(activity.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Suspicious Activity' : 'Create Suspicious Activity'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Description">
              <TextInput
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <Field label="User or System">
              <TextInput
                required
                value={form.userOrSystem}
                onChange={(e) => setForm({ ...form, userOrSystem: e.target.value })}
              />
            </Field>
            <Field label="Risk Score">
              <TextInput
                type="number"
                min={0}
                max={100}
                required
                value={form.riskScore}
                onChange={(e) => setForm({ ...form, riskScore: Number(e.target.value) })}
              />
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
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
