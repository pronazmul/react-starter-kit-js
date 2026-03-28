import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '../../api/userApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            const res = await login(values).unwrap();
            dispatch(setCredentials(res));
            navigate('/');
          } catch {
            setError('root', {
              type: 'server',
              message: 'Login failed',
            });
          }
        })}
        className="w-full max-w-sm p-6 md:p-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 shadow-lg space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Login</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Welcome back</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email
            </label>
            <input
              className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:focus:ring-offset-neutral-800 transition-all"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent dark:focus:ring-offset-neutral-800 transition-all"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
        <button
          disabled={isLoading || !isValid}
          className="w-full bg-accent-500 text-white py-2.5 rounded-md hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 font-medium shadow-sm hover:shadow"
          type="submit"
        >
          {isLoading ? 'Loading…' : 'Sign in'}
        </button>
        <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
          No account?{' '}
          <Link className="text-accent-600 dark:text-accent-400 hover:underline font-medium" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
