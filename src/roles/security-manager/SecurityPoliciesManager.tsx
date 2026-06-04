import { useState, FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Policy, Status } from '@/types/entities';

const empty = (): Omit<Policy, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '', category: 'General', status: 'Active', owner: 'Security Manager', enforcement: 'Enforced', acknowledgment: '0%', compliance: 'Pending',
});

export function SecurityPoliciesManager() {
  const { items, create, update, remove } = useCollection('policies');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [form, setForm] = useState(empty());

  const openCreate = () => { setEditing(null); setForm(empty()); setModalOpen(true); };
  const openEdit = (i: number) => {
    const p = items[i] as Policy;
    setEditing(p);
    setForm({ name: p.name, category: p.category, status: p.status, owner: p.owner, enforcement: p.enforcement, acknowledgment: p.acknowledgment, compliance: p.compliance });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) { update(editing.id, form); showToast('Policy updated successfully'); }
    else { create(form); logActivity(`Created policy: ${form.name}`, 'Security Policies'); showToast('Policy saved'); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Security Policy Management" description="Shared policies stored in the system — visible to all roles." actions={<button type="button" className="btn-primary" onClick={openCreate}>Create Policy</button>} />
      <CrudTable
        headers={['Policy', 'Enforcement', 'Acknowledgment', 'Compliance', 'Status']}
        rows={(items as Policy[]).map((p) => [p.name, p.enforcement ?? '—', p.acknowledgment ?? '—', p.compliance ?? '—', <StatusBadge key={p.id} status={p.status} />])}
        onEdit={openEdit}
        onDelete={(i) => { const p = items[i] as Policy; if (confirm('Delete?')) { remove(p.id); showToast('Deleted'); } }}
      />
      <Modal open={modalOpen} title={editing ? 'Edit Policy' : 'Create Policy'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Policy Name"><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Enforcement"><SelectInput value={form.enforcement} onChange={(e) => setForm({ ...form, enforcement: e.target.value })}><option>Enforced</option><option>Draft</option></SelectInput></Field>
            <Field label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}><option>Active</option><option>Draft</option></SelectInput></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
