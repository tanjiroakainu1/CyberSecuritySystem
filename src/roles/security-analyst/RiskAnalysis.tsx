import { FormEvent, useMemo, useState } from 'react';
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
import { RiskItem, Status } from '@/types/entities';

const emptyForm = (): Omit<RiskItem, 'id' | 'createdAt' | 'updatedAt'> => ({
  asset: '',
  threat: '',
  likelihood: 'Medium',
  impact: 'Medium',
  score: 0,
  status: 'Open',
});

export function RiskAnalysis() {
  const { items, create, update, remove } = useCollection('riskItems');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RiskItem | null>(null);
  const [form, setForm] = useState(emptyForm());
  const risks = items as RiskItem[];

  const averageScore = useMemo(() => {
    if (!risks.length) return 0;
    return risks.reduce((sum, item) => sum + item.score, 0) / risks.length;
  }, [risks]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const risk = items[index] as RiskItem;
    setEditing(risk);
    setForm({
      asset: risk.asset,
      threat: risk.threat,
      likelihood: risk.likelihood,
      impact: risk.impact,
      score: risk.score,
      status: risk.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated risk item: ${form.asset}`, 'Risk Analysis');
      showToast('Risk item updated');
    } else {
      create(form);
      logActivity(`Created risk item: ${form.asset}`, 'Risk Analysis');
      showToast('Risk item created');
    }
    setModalOpen(false);
  };

  const handleDelete = (index: number) => {
    const risk = items[index] as RiskItem;
    if (!confirm('Delete this risk item?')) return;
    remove(risk.id);
    logActivity(`Deleted risk item: ${risk.asset}`, 'Risk Analysis');
    showToast('Risk item deleted');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Risk Analysis"
        description="Perform risk analysis, scoring, and classification of security risks."
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add Risk Item
          </button>
        }
      />

      <div className="grid-cards-3">
        <StatCard
          label="Critical Risks"
          value={risks.filter((r) => r.score >= 8).length}
          change="Immediate mitigation"
          trend="down"
        />
        <StatCard
          label="Average Risk Score"
          value={`${averageScore.toFixed(1)}/10`}
          change="From local risk register"
          trend="neutral"
        />
        <StatCard
          label="Resolved Risks"
          value={risks.filter((r) => ['Resolved', 'Closed'].includes(r.status)).length}
          change={`${risks.length} total tracked`}
          trend="up"
        />
      </div>

      <CrudTable
        headers={['Asset', 'Threat', 'Likelihood', 'Impact', 'Score', 'Status']}
        rows={risks.map((risk) => [
          risk.asset,
          risk.threat,
          risk.likelihood,
          risk.impact,
          risk.score.toFixed(1),
          <StatusBadge key={`status-${risk.id}`} status={risk.status} />,
        ])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Risk Item' : 'Create Risk Item'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Asset">
              <TextInput
                required
                value={form.asset}
                onChange={(e) => setForm({ ...form, asset: e.target.value })}
              />
            </Field>
            <Field label="Threat">
              <TextInput
                required
                value={form.threat}
                onChange={(e) => setForm({ ...form, threat: e.target.value })}
              />
            </Field>
            <Field label="Likelihood">
              <SelectInput
                value={form.likelihood}
                onChange={(e) => setForm({ ...form, likelihood: e.target.value })}
              >
                {['Low', 'Medium', 'High', 'Critical'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Impact">
              <SelectInput
                value={form.impact}
                onChange={(e) => setForm({ ...form, impact: e.target.value })}
              >
                {['Low', 'Medium', 'High', 'Critical'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Score">
              <TextInput
                type="number"
                min={0}
                max={10}
                step={0.1}
                required
                value={form.score}
                onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
              />
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
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
