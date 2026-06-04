import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RoleId } from '@/types/roles';
import { useData } from '@/context/DataContext';

const PATH_ROLE_MAP: Record<string, RoleId> = {
  '/super-admin': 'super-admin',
  '/security-manager': 'security-manager',
  '/security-analyst': 'security-analyst',
  '/incident-response-officer': 'incident-response-officer',
  '/employee': 'employee',
};

export function RoleSync() {
  const location = useLocation();
  const { setCurrentRole, currentUser } = useData();

  useEffect(() => {
    const match = Object.entries(PATH_ROLE_MAP).find(([path]) =>
      location.pathname.startsWith(path),
    );
    if (match) {
      setCurrentRole(match[1]);
    }
  }, [location.pathname, setCurrentRole]);

  useEffect(() => {
    if (currentUser) {
      setCurrentRole(currentUser.roleId);
    }
  }, [currentUser, setCurrentRole]);

  return null;
}
