import { useState, FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { MitigationPlan, Severity, Status } from '@/types/entities';

const empty = (): Omit<MitigationPlan, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '', riskAddressed: '', submittedBy: 'Mike Analyst', status: 'Pending', priority: 'Medium',
});

export function MitigationPlans() {
  const { items, create, update, remove } = useCollection('mitigationPlans');
  const { showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MitigationPlan | null>(null);
  const [form, setForm] = useState(empty());

  const openEdit = (i: number) => {
    const m = items[i] as MitigationPlan;
    setEditing(m);
    setForm({ title: m.title, riskAddressed: m.riskAddressed, submittedBy: m.submittedBy, status: m.status, priority: m.priority });
    setModalOpen(true);
  };

  const approve = (i: number) => {
    const m = items[i] as MitigationPlan;
    update(m.id, { status: 'Completed' });
    showToast(`Plan "${m.title}" approved and saved`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) update(editing.id, form);
    else create(form);
    showToast('Mitigation plan saved successfully');
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Mitigation Plan Approval" description="Approve plans — status updates persist in the system." actions={<button type="button" className="btn-primary" onClick={() => { setEditing(null); setForm(empty()); setModalOpen(true); }}>Add Plan</button>} />
      <CrudTable
        headers={['Title', 'Risk Addressed', 'Submitted By', 'Priority', 'Status', 'Approve']}
        rows={(items as MitigationPlan[]).map((m, i) => [
          m.title, m.riskAddressed, m.submittedBy,
          <StatusBadge key={m.id} status={m.priority} />,
          <StatusBadge key={`s-${m.id}`} status={m.status} />,
          m.status === 'Pending' ? <button key={`a-${m.id}`} type="button" className="text-emerald-600 hover:underline" onClick={() => approve(i)}>Approve</button> : '—',
        ])}
        onEdit={openEdit}
        onDelete={(i) => { if (confirm('Delete?')) remove((items[i] as MitigationPlan).id); }}
      />
      <Modal open={modalOpen} title={editing ? 'Edit Plan' : 'Add Plan'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Title"><TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Risk Addressed"><TextInput value={form.riskAddressed} onChange={(e) => setForm({ ...form, riskAddressed: e.target.value })} /></Field>
            <Field label="Priority"><SelectInput value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Severity })}>{['Low', 'Medium', 'High', 'Critical'].map((s) => <option key={s}>{s}</option>)}</SelectInput></Field>
            <Field label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>{['Pending', 'In Progress', 'Completed'].map((s) => <option key={s}>{s}</option>)}</SelectInput></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
