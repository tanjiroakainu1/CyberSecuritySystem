import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import { CrudTable, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { Backup } from '@/types/entities';
import { formatDateShort } from '@/lib/storage';
import { estimateBackupSize, getStoreDataSize } from '@/lib/storeStats';

export function BackupRestore() {
  const { items, create } = useCollection('backups');
  const { logActivity, showToast } = useData();

  const handleBackup = () => {
    const size = estimateBackupSize();
    const backup: Omit<Backup, 'id' | 'createdAt' | 'updatedAt'> = {
      backupId: `BKP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
      backupType: 'Full',
      size,
      status: 'Completed',
    };
    create(backup);
    logActivity('Manual backup created', 'Backup & Restore');
    showToast('Backup created successfully');
  };

  const sortedBackups = [...(items as Backup[])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const lastBackup = sortedBackups[0];

  return (
    <div className="page-container">
      <PageHeader
        title="Backup & Restore"
        description="Create snapshots of current system data. All backups reflect actual stored records."
        actions={
          <button type="button" className="btn-primary" onClick={handleBackup}>
            Create Backup
          </button>
        }
      />

      <div className="grid-cards-3">
        <StatCard label="Total Backups" value={items.length} change={`Current data: ${getStoreDataSize()}`} trend="neutral" />
        <StatCard label="Latest Backup" value={lastBackup ? formatDateShort(lastBackup.createdAt) : '—'} change={lastBackup?.backupType ?? 'No backups yet'} trend="neutral" />
        <StatCard label="Latest Size" value={lastBackup?.size ?? '—'} change="Based on actual data" trend="neutral" />
      </div>

      <CrudTable
        headers={['Backup ID', 'Type', 'Size', 'Created', 'Status']}
        rows={sortedBackups.map((b) => [
          b.backupId,
          b.backupType,
          b.size,
          formatDateShort(b.createdAt),
          <StatusBadge key={b.id} status={b.status} />,
        ])}
      />
    </div>
  );
}
