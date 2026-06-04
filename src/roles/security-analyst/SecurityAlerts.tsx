import { FormEvent, useState } from 'react';
import { PageHeader, StatCard } from '@/components/ui/PageComponents';
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
import { SecurityAlert, Severity, Status } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';

const emptyForm = (): Omit<SecurityAlert, 'id' | 'createdAt' | 'updatedAt'> => ({
  description: '',
  severity: 'Medium',
  status: 'Open',
  assigned: 'Mike Analyst',
  source: '',
});

export function SecurityAlerts() {
  const { items, create, update, remove } = useCollection('alerts');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SecurityAlert | null>(null);
  const [form, setForm] = useState(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const alert = items[index] as SecurityAlert;
    setEditing(alert);
    setForm({
      description: alert.description,
      severity: alert.severity,
      status: alert.status,
      assigned: alert.assigned,
      source: alert.source,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated security alert: ${form.description}`, 'Security Alerts');
      showToast('Security alert updated');
    } else {
      create(form);
      logActivity(`Created security alert: ${form.description}`, 'Security Alerts');
      showToast('Security alert created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const alert = items[index] as SecurityAlert;
    if (!confirm('Delete this security alert?')) return;
    remove(alert.id);
    logActivity(`Deleted security alert: ${alert.description}`, 'Security Alerts');
    showToast('Security alert deleted');
  };

  const alerts = items as SecurityAlert[];

  return (
    <div className="page-container">
      <PageHeader
        title="Security Alert Management"
        description="Monitor, triage, and respond to security alerts in real time."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Alert
          </button>
        }
      />

      <div className="grid-cards-4">
        <StatCard
          label="Critical"
          value={alerts.filter((a) => a.severity === 'Critical').length}
          change="Immediate action"
          trend="down"
        />
        <StatCard
          label="High"
          value={alerts.filter((a) => a.severity === 'High').length}
          change="Review required"
          trend="neutral"
        />
        <StatCard
          label="Medium"
          value={alerts.filter((a) => a.severity === 'Medium').length}
          change="Monitor"
          trend="neutral"
        />
        <StatCard
          label="Low"
          value={alerts.filter((a) => a.severity === 'Low').length}
          change="Informational"
          trend="up"
        />
      </div>

      <CrudTable
        headers={['Description', 'Severity', 'Status', 'Assigned', 'Source', 'Detected']}
        rows={alerts.map((alert) => [
          alert.description,
          <StatusBadge key={alert.id} status={alert.severity} />,
          <StatusBadge key={`status-${alert.id}`} status={alert.status} />,
          alert.assigned,
          alert.source,
          formatDateShort(alert.createdAt),
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Security Alert' : 'Create Security Alert'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Description">
              <TextInput
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <Field label="Severity">
              <SelectInput
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}
              >
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Assigned To">
              <TextInput
                value={form.assigned}
                onChange={(e) => setForm({ ...form, assigned: e.target.value })}
              />
            </Field>
            <Field label="Source">
              <TextInput
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
