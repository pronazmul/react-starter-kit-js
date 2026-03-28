import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUserMutation } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const userSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email'),
  role: z.enum(['user', 'admin']),
});

export default function UserCreate() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: 'user' },
    mode: 'onChange',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Create User
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Add a new user to the system
        </p>
      </div>
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 bg-white dark:bg-neutral-800 shadow-sm">
        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              await createUser(values).unwrap();
              navigate('/users');
            } catch {
              setError('root', {
                type: 'server',
                message: 'Failed to create user',
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
