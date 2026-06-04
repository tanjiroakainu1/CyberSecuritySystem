import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { ROLES, RoleId } from '@/types/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: RoleId;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useData();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.roleId !== allowedRole) {
    return <Navigate to={ROLES[currentUser.roleId].dashboardPath} replace />;
  }

  return <>{children}</>;
}

interface GuestRouteProps {
  children: ReactNode;
}

/** Redirect authenticated users away from login/register to their dashboard */
export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, currentUser } = useData();

  if (isAuthenticated && currentUser) {
    return <Navigate to={ROLES[currentUser.roleId].dashboardPath} replace />;
  }

  return <>{children}</>;
}
