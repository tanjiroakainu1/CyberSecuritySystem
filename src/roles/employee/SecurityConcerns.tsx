import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import {
  CrudTable,
  Field,
  FormActions,
  Modal,
  SelectInput,
  StatusBadge,
  TextArea,
} from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { SecurityConcern, Status } from '@/types/entities';
import { formatDate } from '@/lib/storage';

const concernDefaults = {
  category: 'General Suggestion',
  concern: '',
  status: 'Open' as Status,
  response: 'Pending review',
};

export function SecurityConcerns() {
  const concerns = useCollection('securityConcerns');
  const { currentUserEmail, logActivity, showToast } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SecurityConcern | null>(null);
  const [form, setForm] = useState(concernDefaults);

  const openCreate = () => {
    setEditing(null);
    setForm(concernDefaults);
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const concern = concerns.items[index];
    setEditing(concern);
    setForm({
      category: concern.category,
      concern: concern.concern,
      status: concern.status,
      response: concern.response,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editing) {
      concerns.update(editing.id, form);
      showToast('Security concern updated');
      logActivity('Updated a security concern', 'Security Concerns');
    } else {
      concerns.create({
        ...form,
        submittedBy: currentUserEmail,
      } satisfies Omit<SecurityConcern, 'id' | 'createdAt' | 'updatedAt'>);
      showToast('Security concern submitted');
      logActivity('Submitted a security concern', 'Security Concerns');
    }

    setModalOpen(false);
    setForm(concernDefaults);
    setEditing(null);
  };

  const handleDelete = (index: number) => {
    const concern = concerns.items[index];
    if (!confirm('Delete this concern?')) return;
    concerns.remove(concern.id);
    showToast('Security concern deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Submit Security Concerns"
        description="Submit general security concerns, questions, or suggestions. Data persists to the system."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            New Concern
          </button>
        }
      />

      <CrudTable
        headers={['Category', 'Concern', 'Status', 'Response', 'Submitted']}
        rows={concerns.items.map((concern) => [
          concern.category,
          concern.concern,
          <StatusBadge key={concern.id} status={concern.status} />,
          concern.response || 'Pending review',
          formatDate(concern.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Security Concern' : 'New Security Concern'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Concern Category">
            <SelectInput
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option>Physical Security</option>
              <option>Access Control</option>
              <option>Data Protection</option>
              <option>Policy Question</option>
              <option>General Suggestion</option>
            </SelectInput>
          </Field>

          <Field label="Your Concern">
            <TextArea
              required
              rows={4}
              value={form.concern}
              placeholder="Describe your security concern..."
              onChange={(e) => setForm((prev) => ({ ...prev, concern: e.target.value }))}
            />
          </Field>

          <Field label="Status">
            <SelectInput
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Status }))}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </SelectInput>
          </Field>

          <Field label="Response">
            <TextArea
              rows={2}
              value={form.response}
              onChange={(e) => setForm((prev) => ({ ...prev, response: e.target.value }))}
            />
          </Field>

          <FormActions onCancel={() => setModalOpen(false)} submitLabel="Save Concern" />
        </form>
      </Modal>
    </div>
  );
}
