import { useState, FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Policy, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyPolicy = (): Omit<Policy, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '', category: 'Access Control', status: 'Active', owner: 'Super Admin',
});

export function SecurityPoliciesAdmin() {
  const { items, create, update, remove } = useCollection('policies');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [form, setForm] = useState(emptyPolicy());

  const openCreate = () => { setEditing(null); setForm(emptyPolicy()); setModalOpen(true); };
  const openEdit = (i: number) => {
    const p = items[i] as Policy;
    setEditing(p);
    setForm({ name: p.name, category: p.category, status: p.status, owner: p.owner, enforcement: p.enforcement, acknowledgment: p.acknowledgment, compliance: p.compliance, version: p.version });
    setModalOpen(true);
  };

  const handleDelete = (i: number) => {
    const p = items[i] as Policy;
    if (confirm(`Delete policy "${p.name}"?`)) {
      remove(p.id);
      logActivity(`Deleted policy: ${p.name}`, 'Security Policies');
      showToast('Policy deleted successfully');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated policy: ${form.name}`, 'Security Policies');
      showToast('Policy updated successfully');
    } else {
      create(form);
      logActivity(`Created policy: ${form.name}`, 'Security Policies');
      showToast('Policy saved successfully');
    }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Security Policy Configuration"
        description="Create and manage security policies. Stored in the system."
        actions={<button type="button" className="btn-primary" onClick={openCreate}>Create Policy</button>}
      />
      <CrudTable
        headers={['Policy Name', 'Category', 'Status', 'Last Updated', 'Owner']}
        rows={(items as Policy[]).map((p) => [p.name, p.category, <StatusBadge key={p.id} status={p.status} />, formatDateShort(p.updatedAt), p.owner])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Modal open={modalOpen} title={editing ? 'Edit Policy' : 'Create Policy'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Policy Name"><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Category"><TextInput required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
            <Field label="Status">
              <SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
                {['Active', 'Draft', 'Inactive', 'Pending'].map((s) => <option key={s} value={s}>{s}</option>)}
              </SelectInput>
            </Field>
            <Field label="Owner"><TextInput value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
