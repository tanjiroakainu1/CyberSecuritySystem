import { useState, FormEvent } from 'react';
import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { ComplianceFramework, Status } from '@/types/entities';

const empty = (): Omit<ComplianceFramework, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '', compliance: '90%', lastAudit: new Date().toISOString().slice(0, 10), findings: 0, status: 'Active',
});

export function ComplianceStatus() {
  const { items, create, update, remove } = useCollection('complianceFrameworks');
  const { showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ComplianceFramework | null>(null);
  const [form, setForm] = useState(empty());

  const list = items as ComplianceFramework[];
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) update(editing.id, form);
    else create(form);
    showToast('Compliance framework saved');
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Compliance Monitoring" description="Manage compliance frameworks in the system." actions={<button type="button" className="btn-primary" onClick={() => { setEditing(null); setForm(empty()); setModalOpen(true); }}>Add Framework</button>} />
      <div className="grid-cards-3">
        <StatCard label="Frameworks" value={list.length} trend="neutral" />
        <StatCard label="Open Findings" value={list.reduce((s, c) => s + c.findings, 0)} trend="down" />
        <StatCard label="Avg Compliance" value={`${Math.round(list.reduce((s, c) => s + parseInt(c.compliance), 0) / (list.length || 1))}%`} trend="up" />
      </div>
      <CrudTable
        headers={['Framework', 'Compliance', 'Last Audit', 'Findings', 'Status']}
        rows={list.map((c) => [c.name, c.compliance, c.lastAudit, c.findings, <StatusBadge key={c.id} status={c.status} />])}
        onEdit={(i) => { const c = list[i]; setEditing(c); setForm({ name: c.name, compliance: c.compliance, lastAudit: c.lastAudit, findings: c.findings, status: c.status }); setModalOpen(true); }}
        onDelete={(i) => { if (confirm('Delete?')) remove(list[i].id); }}
      />
      <Modal open={modalOpen} title={editing ? 'Edit Framework' : 'Add Framework'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Framework"><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Compliance %"><TextInput value={form.compliance} onChange={(e) => setForm({ ...form, compliance: e.target.value })} /></Field>
            <Field label="Findings"><TextInput type="number" value={form.findings} onChange={(e) => setForm({ ...form, findings: Number(e.target.value) })} /></Field>
            <Field label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}><option>Active</option><option>Inactive</option></SelectInput></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
