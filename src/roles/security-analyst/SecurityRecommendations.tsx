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
import { Recommendation, Severity, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  priority: 'Medium',
  category: '',
  status: 'Pending',
});

export function SecurityRecommendations() {
  const { items, create, update, remove } = useCollection('recommendations');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Recommendation | null>(null);
  const [form, setForm] = useState(emptyForm());
  const recommendations = items as Recommendation[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const recommendation = items[index] as Recommendation;
    setEditing(recommendation);
    setForm({
      title: recommendation.title,
      priority: recommendation.priority,
      category: recommendation.category,
      status: recommendation.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated recommendation: ${form.title}`, 'Security Recommendations');
      showToast('Recommendation updated');
    } else {
      create(form);
      logActivity(`Created recommendation: ${form.title}`, 'Security Recommendations');
      showToast('Recommendation created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const recommendation = items[index] as Recommendation;
    if (!confirm('Delete this recommendation?')) return;
    remove(recommendation.id);
    logActivity(`Deleted recommendation: ${recommendation.title}`, 'Security Recommendations');
    showToast('Recommendation deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Security Recommendations"
        description="Recommend security improvements based on analysis and findings."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Recommendation
          </button>
        }
      />

      <CrudTable
        headers={['Recommendation', 'Priority', 'Category', 'Status', 'Submitted']}
        rows={recommendations.map((recommendation) => [
          recommendation.title,
          <StatusBadge key={recommendation.id} status={recommendation.priority} />,
          recommendation.category,
          <StatusBadge key={`status-${recommendation.id}`} status={recommendation.status} />,
          formatDateShort(recommendation.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Recommendation' : 'Create Recommendation'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Recommendation">
              <TextInput
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <Field label="Priority">
              <SelectInput
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Severity })}
              >
                {['Low', 'Medium', 'High', 'Critical'].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Category">
              <TextInput
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {['Pending', 'In Progress', 'Completed', 'Active'].map((status) => (
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
