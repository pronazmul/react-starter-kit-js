import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateUserMutation, useGetUserQuery } from '../../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const userSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email'),
  role: z.enum(['user', 'admin']),
});

export default function UserEdit() {
  const { id } = useParams();
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(id ?? '');
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: 'user' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      const role = user.role === 'admin' ? 'admin' : 'user';
      reset({
        name: user.name ?? '',
        email: user.email,
        role,
      });
    }
  }, [user, reset]);

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
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
            User not found
          </h2>
          <p className="text-red-700 dark:text-red-400 mb-4">
            The user you're looking for doesn't exist.
          </p>
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
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Edit User
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Update user information
        </p>
      </div>
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 bg-white dark:bg-neutral-800 shadow-sm">
        <form
          onSubmit={handleSubmit(async (values) => {
            if (!id) return;
            try {
              await updateUser({ id, ...values }).unwrap();
              navigate('/users');
            } catch {
              setError('root', {
                type: 'server',
                message: 'Failed to update user',
              });
            }
          })}
          className="space-y-5"
        >
          <Input label="Name" required {...register('name')} />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
          <Input label="Email" type="email" required {...register('email')} />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
          <Select label="Role" {...register('role')}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          {errors.role && (
            <p className="text-xs text-red-500">{errors.role.message}</p>
          )}
          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={isLoading || !isValid}>
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
