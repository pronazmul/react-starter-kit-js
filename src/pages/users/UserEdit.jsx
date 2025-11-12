import { useState, useEffect } from 'react';
import { useUpdateUserMutation, useGetUserQuery } from '../../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export default function UserEdit() {
  const { id } = useParams();
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(id);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', role: user.role || 'user' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id, ...form }).unwrap();
      navigate('/users');
    } catch (err) {
      alert('Failed to update user');
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neutral-600 dark:text-neutral-400">Loading…</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">User not found</h2>
          <p className="text-red-700 dark:text-red-400 mb-4">The user you're looking for doesn't exist.</p>
          <Button variant="secondary" onClick={() => navigate('/users')}>
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Edit User</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Update user information</p>
      </div>
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 bg-white dark:bg-neutral-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update User'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

