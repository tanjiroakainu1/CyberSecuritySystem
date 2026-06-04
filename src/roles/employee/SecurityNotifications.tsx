import { PageHeader, StatCard } from '@/components/ui/PageComponents';
import { CrudTable, StatusBadge } from '@/components/ui/CrudComponents';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/lib/storage';

export function SecurityNotifications() {
  const { store, markNotificationRead, markAllNotificationsRead } = useData();

  const unreadCount = store.notifications.filter((notification) => !notification.read).length;

  return (
    <div className="page-container">
      <PageHeader
        title="Security Notifications"
        description="Manage security alerts and updates. Read state is stored in the system."
        actions={
          <button type="button" className="btn-secondary" onClick={markAllNotificationsRead}>
            Mark All Read
          </button>
        }
      />

      <div className="mb-6 grid-cards-2">
        <StatCard label="Total Notifications" value={store.notifications.length} />
        <StatCard label="Unread" value={unreadCount} trend={unreadCount ? 'down' : 'neutral'} />
      </div>

      <CrudTable
        headers={['Notification', 'Type', 'Priority', 'Date', 'Status', 'Action']}
        rows={store.notifications.map((notification) => [
          notification.title,
          notification.type,
          <StatusBadge key={notification.id} status={notification.priority} />,
          formatDate(notification.createdAt),
          notification.read ? 'Read' : 'Unread',
          notification.read ? (
            'Done'
          ) : (
            <button
              key={`read-${notification.id}`}
              type="button"
              className="btn-primary"
              onClick={() => markNotificationRead(notification.id)}
            >
              Mark Read
            </button>
          ),
        ])}
      />
    </div>
  );
}
