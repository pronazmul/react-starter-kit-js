import { useState } from 'react';
import { useCreateUserMutation } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export default function UserCreate() {
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(form).unwrap();
      navigate('/users');
    } catch (err) {
      alert('Failed to create user');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Create User</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Add a new user to the system</p>
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
              {isLoading ? 'Creating...' : 'Create User'}
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

