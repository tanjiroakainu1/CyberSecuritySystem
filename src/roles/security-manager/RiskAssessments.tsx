import { useState, FormEvent } from 'react';
import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { RiskAssessment, Severity, Status } from '@/types/entities';

const empty = (): Omit<RiskAssessment, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '', riskLevel: 'Medium', owner: 'Security Manager', status: 'In Progress', dueDate: new Date().toISOString().slice(0, 10),
});

export function RiskAssessments() {
  const { items, create, update, remove } = useCollection('riskAssessments');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RiskAssessment | null>(null);
  const [form, setForm] = useState(empty());

  const openCreate = () => { setEditing(null); setForm(empty()); setModalOpen(true); };
  const openEdit = (i: number) => {
    const r = items[i] as RiskAssessment;
    setEditing(r);
    setForm({ name: r.name, riskLevel: r.riskLevel, owner: r.owner, status: r.status, dueDate: r.dueDate });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) { update(editing.id, form); showToast('Assessment updated'); }
    else { create(form); logActivity(`Created risk assessment: ${form.name}`, 'Risk Assessments'); showToast('Saved successfully'); }
    setModalOpen(false);
  };

  const list = items as RiskAssessment[];
  return (
    <div className="page-container">
      <PageHeader title="Risk Assessment Management" description="CRUD risk assessments in the system." actions={<button type="button" className="btn-primary" onClick={openCreate}>New Assessment</button>} />
      <div className="grid-cards-3">
        <StatCard label="High Risk" value={list.filter((r) => r.riskLevel === 'High' || r.riskLevel === 'Critical').length} trend="down" />
        <StatCard label="In Progress" value={list.filter((r) => r.status === 'In Progress').length} trend="neutral" />
        <StatCard label="Total" value={list.length} trend="neutral" />
      </div>
      <CrudTable
        headers={['Assessment', 'Risk Level', 'Owner', 'Status', 'Due Date']}
        rows={list.map((r) => [r.name, <StatusBadge key={r.id} status={r.riskLevel} />, r.owner, <StatusBadge key={`s-${r.id}`} status={r.status} />, r.dueDate])}
        onEdit={openEdit}
        onDelete={(i) => { if (confirm('Delete?')) { remove(list[i].id); showToast('Deleted'); } }}
      />
      <Modal open={modalOpen} title={editing ? 'Edit Assessment' : 'New Assessment'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Name"><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Risk Level"><SelectInput value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value as Severity })}>{['Low', 'Medium', 'High', 'Critical'].map((s) => <option key={s}>{s}</option>)}</SelectInput></Field>
            <Field label="Owner"><TextInput value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></Field>
            <Field label="Due Date"><TextInput type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
            <Field label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>{['In Progress', 'Completed', 'Pending', 'Open'].map((s) => <option key={s}>{s}</option>)}</SelectInput></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
