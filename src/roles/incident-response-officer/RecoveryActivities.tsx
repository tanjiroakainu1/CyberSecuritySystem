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
import { RecoveryTask, Status } from '@/types/entities';

const emptyForm = (): Omit<RecoveryTask, 'id' | 'createdAt' | 'updatedAt'> => ({
  incidentId: '',
  action: '',
  system: '',
  status: 'Pending',
  owner: '',
});

export function RecoveryActivities() {
  const { items, create, update, remove } = useCollection('recoveryTasks');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RecoveryTask | null>(null);
  const [form, setForm] = useState(emptyForm());
  const tasks = items as RecoveryTask[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const task = items[index] as RecoveryTask;
    setEditing(task);
    setForm({
      incidentId: task.incidentId,
      action: task.action,
      system: task.system,
      status: task.status,
      owner: task.owner,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated recovery task: ${form.action}`, 'Recovery Activities');
      showToast('Recovery task updated');
    } else {
      create(form);
      logActivity(`Created recovery task: ${form.action}`, 'Recovery Activities');
      showToast('Recovery task created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const task = items[index] as RecoveryTask;
    if (!confirm('Delete this recovery task?')) return;
    remove(task.id);
    logActivity(`Deleted recovery task: ${task.action}`, 'Recovery Activities');
    showToast('Recovery task deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Recovery Activity Coordination"
        description="Coordinate recovery activities and system restoration after incidents."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Recovery Task
          </button>
        }
      />

      <CrudTable
        headers={['Incident ID', 'Recovery Action', 'System', 'Status', 'Owner']}
        rows={tasks.map((task) => [
          task.incidentId,
          task.action,
          task.system,
          <StatusBadge key={`status-${task.id}`} status={task.status} />,
          task.owner,
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Recovery Task' : 'Create Recovery Task'}
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
            <Field label="Recovery Action">
              <TextInput
                required
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value })}
              />
            </Field>
            <Field label="System">
              <TextInput
                required
                value={form.system}
                onChange={(e) => setForm({ ...form, system: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {['Pending', 'In Progress', 'Completed', 'Open'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Owner">
              <TextInput
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
              />
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
