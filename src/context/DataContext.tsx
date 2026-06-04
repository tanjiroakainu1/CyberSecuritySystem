import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import {
  AppStore,
  BaseEntity,
  CollectionKey,
  Activity,
  CredentialSettings,
  User,
} from '@/types/entities';
import {
  loadStore,
  saveStore,
  generateId,
  nowISO,
  loadSession,
  saveSession,
} from '@/lib/storage';
import { RoleId, ROLES } from '@/types/roles';
import { DEFAULT_PASSWORD } from '@/data/defaultAccounts';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  roleId: RoleId;
}

interface DataContextValue {
  store: AppStore;
  currentUser: User | null;
  isAuthenticated: boolean;
  currentRole: RoleId;
  setCurrentRole: (role: RoleId) => void;
  currentUserEmail: string;
  toast: string | null;
  showToast: (message: string) => void;
  login: (email: string, password: string) => User | null;
  quickLogin: (roleId: RoleId) => User | null;
  register: (input: RegisterInput) => User | null;
  logout: () => void;
  create: <K extends CollectionKey>(
    collection: K,
    item: Omit<AppStore[K][number], keyof BaseEntity>,
  ) => AppStore[K][number];
  update: <K extends CollectionKey>(
    collection: K,
    id: string,
    updates: Partial<AppStore[K][number]>,
  ) => void;
  remove: <K extends CollectionKey>(collection: K, id: string) => void;
  logActivity: (action: string, module: string, userEmail?: string) => void;
  updateCredentials: (updates: Partial<CredentialSettings>) => void;
  acknowledgePolicy: (policyId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSystemSetting: (id: string, value: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

let listeners: Array<() => void> = [];
let cachedStore: AppStore | null = null;

function getSnapshot(): AppStore {
  if (!cachedStore) {
    cachedStore = loadStore();
  }
  return cachedStore;
}

function emitChange() {
  cachedStore = loadStore();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function persistStore(store: AppStore) {
  saveStore(store);
  emitChange();
}

function establishSession(
  user: User,
  logActivityFn?: (action: string, module: string, userEmail?: string) => void,
) {
  saveSession({ userId: user.id });

  const current = getSnapshot();
  const users = current.users.map((u) =>
    u.id === user.id ? { ...u, lastLogin: nowISO(), updatedAt: nowISO() } : u,
  );
  persistStore({ ...current, users });

  logActivityFn?.(`User logged in: ${user.email}`, 'Authentication', user.email);
  return user;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const session = loadSession();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (!session) return null;
    return store.users.find((u) => u.id === session.userId && u.status === 'Active') ?? null;
  });
  const [currentRole, setCurrentRole] = useState<RoleId>(
    () => currentUser?.roleId ?? 'super-admin',
  );
  const [toast, setToast] = useState<string | null>(null);

  const currentUserEmail = currentUser?.email ?? '';

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const logActivity = useCallback(
    (action: string, module: string, userEmail?: string) => {
      const activity: Activity = {
        id: generateId('act'),
        action,
        user: userEmail ?? (currentUserEmail || 'system'),
        module,
        severity: 'Low',
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      const next = { ...getSnapshot(), activities: [activity, ...getSnapshot().activities] };
      persistStore(next);
    },
    [currentUserEmail],
  );

  const login = useCallback(
    (email: string, password: string): User | null => {
      const user = getSnapshot().users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );

      if (!user) {
        showToast('Invalid email or password');
        return null;
      }

      if (user.status !== 'Active') {
        showToast('Account is inactive. Contact administrator.');
        return null;
      }

      setCurrentUser(user);
      setCurrentRole(user.roleId);
      establishSession(user, logActivity);
      showToast(`Welcome back, ${user.name}`);
      return user;
    },
    [logActivity, showToast],
  );

  const quickLogin = useCallback(
    (roleId: RoleId): User | null => {
      const user = getSnapshot().users.find((u) => u.roleId === roleId && u.status === 'Active');
      if (!user) {
        showToast('No active user found for this role');
        return null;
      }

      setCurrentUser(user);
      setCurrentRole(roleId);
      establishSession(user, logActivity);
      showToast(`Logged in as ${user.name} (${ROLES[roleId].name})`);
      return user;
    },
    [logActivity, showToast],
  );

  const register = useCallback(
    (input: RegisterInput): User | null => {
      const current = getSnapshot();
      const exists = current.users.some(
        (u) => u.email.toLowerCase() === input.email.toLowerCase(),
      );

      if (exists) {
        showToast('Email already registered');
        return null;
      }

      if (input.password.length < 6) {
        showToast('Password must be at least 6 characters');
        return null;
      }

      const role = ROLES[input.roleId];
      const newUser: User = {
        id: generateId('u'),
        name: input.name,
        email: input.email.toLowerCase(),
        password: input.password,
        role: role.name,
        roleId: input.roleId,
        status: 'Active',
        lastLogin: nowISO(),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };

      persistStore({ ...current, users: [newUser, ...current.users] });
      logActivity(`New user registered: ${newUser.email}`, 'Authentication', newUser.email);

      setCurrentUser(newUser);
      setCurrentRole(newUser.roleId);
      saveSession({ userId: newUser.id });
      showToast(`Account created. Welcome, ${newUser.name}!`);
      return newUser;
    },
    [logActivity, showToast],
  );

  const logout = useCallback(() => {
    const email = currentUser?.email;
    if (email) {
      logActivity(`User logged out: ${email}`, 'Authentication', email);
    }
    setCurrentUser(null);
    saveSession(null);
    showToast('Logged out successfully');
  }, [currentUser, logActivity, showToast]);

  const create = useCallback(
    <K extends CollectionKey>(
      collection: K,
      item: Omit<AppStore[K][number], keyof BaseEntity>,
    ): AppStore[K][number] => {
      const newItem = {
        ...item,
        id: generateId(String(collection).slice(0, 3)),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      } as AppStore[K][number];

      const current = getSnapshot();
      const next = {
        ...current,
        [collection]: [newItem, ...(current[collection] as BaseEntity[])],
      } as AppStore;
      persistStore(next);
      return newItem;
    },
    [],
  );

  const update = useCallback(
    <K extends CollectionKey>(
      collection: K,
      id: string,
      updates: Partial<AppStore[K][number]>,
    ) => {
      const current = getSnapshot();
      const items = (current[collection] as BaseEntity[]).map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: nowISO() } : item,
      );
      persistStore({ ...current, [collection]: items } as AppStore);

      if (collection === 'users' && currentUser?.id === id) {
        const updated = items.find((u) => u.id === id) as User | undefined;
        if (updated) setCurrentUser(updated);
      }
    },
    [currentUser],
  );

  const remove = useCallback(<K extends CollectionKey>(collection: K, id: string) => {
    const current = getSnapshot();
    const items = (current[collection] as BaseEntity[]).filter((item) => item.id !== id);
    persistStore({ ...current, [collection]: items } as AppStore);
  }, []);

  const updateCredentials = useCallback((updates: Partial<CredentialSettings>) => {
    const current = getSnapshot();
    persistStore({
      ...current,
      credentials: { ...current.credentials, ...updates },
    });
  }, []);

  const acknowledgePolicy = useCallback(
    (policyId: string) => {
      const current = getSnapshot();
      persistStore({
        ...current,
        policyAcknowledgments: { ...current.policyAcknowledgments, [policyId]: true },
      });
      logActivity(`Policy ${policyId} acknowledged`, 'Cybersecurity Policies');
      showToast('Policy acknowledged successfully');
    },
    [logActivity, showToast],
  );

  const markNotificationRead = useCallback((id: string) => {
    const current = getSnapshot();
    const notifications = current.notifications.map((n) =>
      n.id === id ? { ...n, read: true, updatedAt: nowISO() } : n,
    );
    persistStore({ ...current, notifications });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    const current = getSnapshot();
    const notifications = current.notifications.map((n) => ({
      ...n,
      read: true,
      updatedAt: nowISO(),
    }));
    persistStore({ ...current, notifications });
    showToast('All notifications marked as read');
  }, [showToast]);

  const updateSystemSetting = useCallback(
    (id: string, value: string) => {
      const current = getSnapshot();
      const systemSettings = current.systemSettings.map((s) =>
        s.id === id ? { ...s, value, updatedAt: nowISO() } : s,
      );
      persistStore({ ...current, systemSettings });
      logActivity('System setting updated', 'System Settings');
      showToast('Setting saved successfully');
    },
    [logActivity, showToast],
  );

  const value = useMemo(
    () => ({
      store,
      currentUser,
      isAuthenticated: !!currentUser,
      currentRole,
      setCurrentRole,
      currentUserEmail,
      toast,
      showToast,
      login,
      quickLogin,
      register,
      logout,
      create,
      update,
      remove,
      logActivity,
      updateCredentials,
      acknowledgePolicy,
      markNotificationRead,
      markAllNotificationsRead,
      updateSystemSetting,
    }),
    [
      store,
      currentUser,
      currentRole,
      currentUserEmail,
      toast,
      showToast,
      login,
      quickLogin,
      register,
      logout,
      create,
      update,
      remove,
      logActivity,
      updateCredentials,
      acknowledgePolicy,
      markNotificationRead,
      markAllNotificationsRead,
      updateSystemSetting,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export function useCollection<K extends CollectionKey>(collection: K) {
  const { store, create, update, remove } = useData();
  return {
    items: store[collection] as AppStore[K],
    create: (item: Omit<AppStore[K][number], keyof BaseEntity>) => create(collection, item),
    update: (id: string, updates: Partial<AppStore[K][number]>) => update(collection, id, updates),
    remove: (id: string) => remove(collection, id),
  };
}

export function getRoleLabel(roleId: RoleId): string {
  return ROLES[roleId].name;
}

export { DEFAULT_PASSWORD };
