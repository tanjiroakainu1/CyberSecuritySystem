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
import { ResponseAction, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<ResponseAction, 'id' | 'createdAt' | 'updatedAt'> => ({
  incidentId: '',
  action: '',
  assignedTo: '',
  status: 'Pending',
  due: '',
});

export function ResponseActions() {
  const { items, create, update, remove } = useCollection('responseActions');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ResponseAction | null>(null);
  const [form, setForm] = useState(emptyForm());
  const actions = items as ResponseAction[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const action = items[index] as ResponseAction;
    setEditing(action);
    setForm({
      incidentId: action.incidentId,
      action: action.action,
      assignedTo: action.assignedTo,
      status: action.status,
      due: action.due,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated response action: ${form.action}`, 'Response Actions');
      showToast('Response action updated');
    } else {
      create(form);
      logActivity(`Created response action: ${form.action}`, 'Response Actions');
      showToast('Response action created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const action = items[index] as ResponseAction;
    if (!confirm('Delete this response action?')) return;
    remove(action.id);
    logActivity(`Deleted response action: ${action.action}`, 'Response Actions');
    showToast('Response action deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Response Action Management"
        description="Manage and execute incident response actions and containment measures."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Action
          </button>
        }
      />

      <CrudTable
        headers={['Incident ID', 'Action', 'Assigned To', 'Status', 'Due']}
        rows={actions.map((action) => [
          action.incidentId,
          action.action,
          action.assignedTo,
          <StatusBadge key={`status-${action.id}`} status={action.status} />,
          action.due ? formatDateShort(action.due) : '—',
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Response Action' : 'Create Response Action'}
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
            <Field label="Action">
              <TextInput
                required
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value })}
              />
            </Field>
            <Field label="Assigned To">
              <TextInput
                required
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {['Pending', 'In Progress', 'Completed', 'Open', 'Resolved'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Due Date">
              <TextInput
                type="date"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
              />
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
