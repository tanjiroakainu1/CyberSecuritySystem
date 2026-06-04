import { PageHeader } from '@/components/ui/PageComponents';
import { CrudTable, StatusBadge } from '@/components/ui/CrudComponents';
import { useData } from '@/context/DataContext';

export function CybersecurityPolicies() {
  const { store, acknowledgePolicy, showToast } = useData();

  const pendingCount = store.policies.filter((policy) => !store.policyAcknowledgments[policy.id]).length;

  const acknowledgeAllPending = () => {
    const pendingPolicies = store.policies.filter((policy) => !store.policyAcknowledgments[policy.id]);
    if (!pendingPolicies.length) {
      showToast('No pending policies to acknowledge');
      return;
    }

    pendingPolicies.forEach((policy) => acknowledgePolicy(policy.id));
    showToast('All pending policies acknowledged');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Cybersecurity Policies"
        description="View and acknowledge cybersecurity policies. Acknowledgments are saved in the system."
        actions={
          <button type="button" className="btn-primary" onClick={acknowledgeAllPending}>
            Acknowledge All Pending ({pendingCount})
          </button>
        }
      />

      <CrudTable
        headers={['Policy', 'Category', 'Version', 'Acknowledgment', 'Status', 'Action']}
        rows={store.policies.map((policy) => {
          const acknowledged = Boolean(store.policyAcknowledgments[policy.id]);
          return [
            policy.name,
            policy.category,
            policy.version ?? '-',
            acknowledged ? 'Acknowledged' : 'Pending',
            <StatusBadge key={policy.id} status={policy.status} />,
            acknowledged ? (
              'Done'
            ) : (
              <button
                key={`ack-${policy.id}`}
                type="button"
                className="btn-secondary"
                onClick={() => acknowledgePolicy(policy.id)}
              >
                Acknowledge
              </button>
            ),
          ];
        })}
      />
    </div>
  );
}
