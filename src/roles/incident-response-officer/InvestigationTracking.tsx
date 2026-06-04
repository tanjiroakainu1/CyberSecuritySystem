import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import {
  CrudTable,
  Modal,
  Field,
  TextInput,
  FormActions,
} from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Investigation } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<Investigation, 'id' | 'createdAt' | 'updatedAt'> => ({
  incidentId: '',
  title: '',
  leadInvestigator: 'Lisa Officer',
  progress: 0,
  evidenceItems: 0,
});

export function InvestigationTracking() {
  const { items, create, update, remove } = useCollection('investigations');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Investigation | null>(null);
  const [form, setForm] = useState(emptyForm());
  const investigations = items as Investigation[];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const investigation = items[index] as Investigation;
    setEditing(investigation);
    setForm({
      incidentId: investigation.incidentId,
      title: investigation.title,
      leadInvestigator: investigation.leadInvestigator,
      progress: investigation.progress,
      evidenceItems: investigation.evidenceItems,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated investigation: ${form.title}`, 'Investigation Tracking');
      showToast('Investigation updated');
    } else {
      create(form);
      logActivity(`Created investigation: ${form.title}`, 'Investigation Tracking');
      showToast('Investigation created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const investigation = items[index] as Investigation;
    if (!confirm('Delete this investigation?')) return;
    remove(investigation.id);
    logActivity(`Deleted investigation: ${investigation.title}`, 'Investigation Tracking');
    showToast('Investigation deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Incident Investigation Tracking"
        description="Track investigation progress, timelines, and evidence collection."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Investigation
          </button>
        }
      />

      <CrudTable
        headers={['Incident ID', 'Title', 'Lead Investigator', 'Progress', 'Evidence Items', 'Updated']}
        rows={investigations.map((investigation) => [
          investigation.incidentId,
          investigation.title,
          investigation.leadInvestigator,
          `${investigation.progress}%`,
          investigation.evidenceItems,
          formatDateShort(investigation.updatedAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Investigation' : 'Create Investigation'}
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
            <Field label="Lead Investigator">
              <TextInput
                value={form.leadInvestigator}
                onChange={(e) => setForm({ ...form, leadInvestigator: e.target.value })}
              />
            </Field>
            <Field label="Progress (%)">
              <TextInput
                type="number"
                min={0}
                max={100}
                required
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
              />
            </Field>
            <Field label="Evidence Items">
              <TextInput
                type="number"
                min={0}
                required
                value={form.evidenceItems}
                onChange={(e) => setForm({ ...form, evidenceItems: Number(e.target.value) })}
              />
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
