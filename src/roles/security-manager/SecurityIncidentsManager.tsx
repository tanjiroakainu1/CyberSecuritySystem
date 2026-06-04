import { useState, FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, TextArea, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Incident, Severity, Status } from '@/types/entities';

const empty = (): Omit<Incident, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '', description: '', severity: 'Medium', status: 'Open', phase: 'Investigation', category: 'General',
  affectedAssets: '', assignedTo: 'Lisa Officer', reportedBy: 'sarah@company.com', source: 'manager',
});

export function SecurityIncidentsManager() {
  const { items, create, update, remove } = useCollection('incidents');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Incident | null>(null);
  const [form, setForm] = useState(empty());

  const openEdit = (i: number) => {
    const inc = items[i] as Incident;
    setEditing(inc);
    setForm({ title: inc.title, description: inc.description, severity: inc.severity, status: inc.status, phase: inc.phase, category: inc.category, affectedAssets: inc.affectedAssets, assignedTo: inc.assignedTo, reportedBy: inc.reportedBy, source: inc.source });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) { update(editing.id, form); logActivity(`Updated incident: ${form.title}`, 'Incidents'); showToast('Incident updated'); }
    else { create(form); logActivity(`Created incident: ${form.title}`, 'Incidents'); showToast('Incident saved'); }
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Security Incident Review" description="Shared incidents — employee reports appear here automatically." actions={<button type="button" className="btn-primary" onClick={() => { setEditing(null); setForm(empty()); setModalOpen(true); }}>Add Incident</button>} />
      <CrudTable
        headers={['Title', 'Severity', 'Status', 'Phase', 'Assigned To', 'Reported By']}
        rows={(items as Incident[]).map((i) => [i.title, <StatusBadge key={i.id} status={i.severity} />, <StatusBadge key={`s-${i.id}`} status={i.status} />, i.phase, i.assignedTo, i.reportedBy])}
        onEdit={openEdit}
        onDelete={(idx) => { const i = items[idx] as Incident; if (confirm('Delete incident?')) { remove(i.id); showToast('Deleted'); } }}
      />
      <Modal open={modalOpen} title={editing ? 'Edit Incident' : 'Add Incident'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Title"><TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Description"><TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Severity"><SelectInput value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}>{['Low', 'Medium', 'High', 'Critical'].map((s) => <option key={s}>{s}</option>)}</SelectInput></Field>
            <Field label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>{['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => <option key={s}>{s}</option>)}</SelectInput></Field>
            <Field label="Assigned To"><TextInput value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} /></Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
