import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import { CrudTable, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData } from '@/context/DataContext';
import { formatDateShort } from '@/lib/storage';

export function SecurityTraining() {
  const trainingModules = useCollection('trainingModules');
  const { logActivity, showToast } = useData();

  const completedModules = trainingModules.items.filter((module) => module.status === 'Completed').length;
  const totalModules = trainingModules.items.length;
  const progress = totalModules ? Math.round((completedModules / totalModules) * 100) : 0;

  const markComplete = (id: string) => {
    const module = trainingModules.items.find((item) => item.id === id);
    if (!module) return;

    trainingModules.update(id, {
      status: 'Completed',
      score: module.score === '-' ? '100%' : module.score,
      completedAt: new Date().toISOString(),
    });

    logActivity(`Completed training module: ${module.name}`, 'Security Training');
    showToast(`${module.name} marked as complete`);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Security Awareness Training"
        description="Complete training modules and track progress. Completion is persisted to the system."
      />

      <div className="grid-cards-3">
        <StatCard
          label="Overall Progress"
          value={`${progress}%`}
          change={`${completedModules} of ${totalModules} modules`}
          trend="up"
        />
        <StatCard
          label="Completed Modules"
          value={completedModules}
          change={totalModules ? `${totalModules - completedModules} remaining` : 'No modules'}
          trend="neutral"
        />
        <StatCard label="Certification" value={completedModules === totalModules ? 'Valid' : 'In Progress'} />
      </div>

      <CrudTable
        headers={['Module', 'Topic', 'Duration', 'Status', 'Score', 'Completed', 'Action']}
        rows={trainingModules.items.map((module) => [
          module.name,
          module.topic,
          module.duration,
          <StatusBadge key={module.id} status={module.status} />,
          module.score,
          module.completedAt ? formatDateShort(module.completedAt) : '-',
          module.status === 'Completed' ? (
            'Completed'
          ) : (
            <button
              key={`complete-${module.id}`}
              type="button"
              className="btn-primary"
              onClick={() => markComplete(module.id)}
            >
              Mark Complete
            </button>
          ),
        ])}
      />
    </div>
  );
}
