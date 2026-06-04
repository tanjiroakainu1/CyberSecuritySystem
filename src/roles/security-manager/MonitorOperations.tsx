import { useState, FormEvent } from 'react';
import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Operation, Status } from '@/types/entities';
import { formatDateShort, nowISO } from '@/lib/storage';

const empty = (): Omit<Operation, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '', status: 'Active', lastCheck: nowISO(), alerts: 0, responsible: '',
});

export function MonitorOperations() {
  const { items, create, update, remove } = useCollection('operations');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Operation | null>(null);
  const [form, setForm] = useState(empty());

  const openCreate = () => { setEditing(null); setForm(empty()); setModalOpen(true); };
  const openEdit = (i: number) => {
    const o = items[i] as Operation;
    setEditing(o);
    setForm({ name: o.name, status: o.status, lastCheck: o.lastCheck, alerts: o.alerts, responsible: o.responsible });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = { ...form, lastCheck: nowISO() };
    if (editing) { update(editing.id, data); showToast('Operation updated'); }
    else { create(data); logActivity(`Added operation: ${form.name}`, 'Operations'); showToast('Operation saved'); }
    setModalOpen(false);
  };

  const ops = items as Operation[];
  return (
    <div className="page-container">
      <PageHeader title="Monitor Cybersecurity Operations" description="Manage operations stored in the system." actions={<button type="button" className="btn-primary" onClick={openCreate}>Add Operation</button>} />
      <div className="grid-cards-4">
        <StatCard label="Active Monitors" value={ops.filter((o) => o.status === 'Active').length} trend="up" />
        <StatCard label="Total Alerts" value={ops.reduce((s, o) => s + o.alerts, 0)} trend="neutral" />
        <StatCard label="Operations" value={ops.length} trend="neutral" />
      </div>
      <CrudTable
        headers={['Operation', 'Status', 'Last Check', 'Alerts', 'Responsible']}
        rows={ops.map((o) => [o.name, <StatusBadge key={o.id} status={o.status} />, formatDateShort(o.lastCheck), o.alerts, o.responsible])}
        onEdit={openEdit}
        onDelete={(i) => { if (confirm('Delete?')) { remove(ops[i].id); showToast('Deleted'); } }}
      />
      <Modal open={modalOpen} title={editing ? 'Edit Operation' : 'Add Operation'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Name"><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}><option>Active</option><option>Inactive</option><option>Pending</option></SelectInput></Field>
            <Field label="Responsible"><TextInput value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} /></Field>
            <Field label="Alerts"><TextInput type="number" value={form.alerts} onChange={(e) => setForm({ ...form, alerts: Number(e.target.value) })} /></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
