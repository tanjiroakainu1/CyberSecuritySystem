import { useState, FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageComponents';
import { CrudTable, Modal, Field, TextInput, SelectInput, FormActions, StatusBadge } from '@/components/ui/CrudComponents';
import { useCollection, useData, DEFAULT_PASSWORD } from '@/context/DataContext';
import { User } from '@/types/entities';
import { RoleId, ROLE_LIST } from '@/types/roles';
import { formatDateShort } from '@/lib/storage';

const emptyUser = (): Omit<User, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  email: '',
  password: DEFAULT_PASSWORD,
  role: 'Employee',
  roleId: 'employee',
  status: 'Active',
  lastLogin: new Date().toISOString(),
});

export function UsersRoles() {
  const { items, create, update, remove } = useCollection('users');
  const { logActivity, showToast } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyUser());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyUser());
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const user = items[index] as User;
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      roleId: user.roleId,
      status: user.status,
      lastLogin: user.lastLogin,
    });
    setModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const user = items[index] as User;
    if (confirm(`Delete user ${user.name}?`)) {
      remove(user.id);
      logActivity(`Deleted user: ${user.name}`, 'User Management');
      showToast('User deleted successfully');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
      logActivity(`Updated user: ${form.name}`, 'User Management');
      showToast('User updated successfully');
    } else {
      create(form);
      logActivity(`Created user: ${form.name}`, 'User Management');
      showToast('User saved successfully — they can now login');
    }
    setModalOpen(false);
  };

  const handleRoleChange = (roleId: RoleId) => {
    const role = ROLE_LIST.find((r) => r.id === roleId);
    setForm({ ...form, roleId, role: role?.name ?? form.role });
  };

  return (
    <div className="page-container">
      <PageHeader
        title="User & Role Management"
        description="Manage all users and roles. Users can login with their email and password."
        actions={<button type="button" className="btn-primary" onClick={openCreate}>Add User</button>}
      />

      <CrudTable
        headers={['Name', 'Email', 'Role', 'Status', 'Last Login']}
        rows={(items as User[]).map((u) => [u.name, u.email, u.role, <StatusBadge key={u.id} status={u.status} />, formatDateShort(u.lastLogin)])}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal open={modalOpen} title={editing ? 'Edit User' : 'Add User'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field label="Name">
              <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <TextInput required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Password">
              <TextInput required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Field>
            <Field label="Role">
              <SelectInput value={form.roleId} onChange={(e) => handleRoleChange(e.target.value as RoleId)}>
                {ROLE_LIST.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as User['status'] })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </SelectInput>
            </Field>
          </div>
          <FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? 'Update' : 'Create'} />
        </form>
      </Modal>
    </div>
  );
}
