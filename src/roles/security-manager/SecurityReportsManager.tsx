import { useState, FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Report, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const empty = (): Omit<Report, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '', type: 'Security', generatedBy: 'Security Manager', status: 'Completed', period: '',
});

export function SecurityReportsManager() {
  const { items, create, update, remove } = useCollection('reports');
  const { showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [form, setForm] = useState(empty());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) update(editing.id, form);
    else create(form);
    showToast('Report saved successfully');
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Security Reports" description="Shared reports collection in the system." actions={<button type="button" className="btn-primary" onClick={() => { setEditing(null); setForm(empty()); setModalOpen(true); }}>Generate Report</button>} />
      <CrudTable
        headers={['Report', 'Category', 'Period', 'Generated', 'Status']}
        rows={(items as Report[]).map((r) => [r.name, r.type, r.period ?? '—', formatDateShort(r.createdAt), <StatusBadge key={r.id} status={r.status} />])}
        onEdit={(i) => { const r = items[i] as Report; setEditing(r); setForm({ name: r.name, type: r.type, generatedBy: r.generatedBy, status: r.status, period: r.period ?? '' }); setModalOpen(true); }}
        onDelete={(i) => { if (confirm('Delete?')) remove((items[i] as Report).id); }}
      />
      <Modal open={modalOpen} title="Generate Report" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Report Name"><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Category"><TextInput value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></Field>
            <Field label="Period"><TextInput value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></Field>
            <Field label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}><option>Completed</option><option>Pending</option></SelectInput></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
