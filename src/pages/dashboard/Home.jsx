import { useAppSelector } from '../../app/hooks';
import { useGetUsersQuery } from '../../api/userApi';

export default function Home() {
  const { user } = useAppSelector(s => s.auth);
  const { data: users = [] } = useGetUsersQuery();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Welcome back, {user?.name || user?.email || 'User'}!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{users.length}</p>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Welcome</h3>
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{user?.name || user?.email || 'User'}</p>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Role</h3>
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
            <span className="inline-block px-2 py-1 text-xs rounded-md bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
              {user?.role || 'user'}
            </span>
          </p>
        </div>
      </div>
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 bg-white dark:bg-neutral-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <a 
            href="/users" 
            className="px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 font-medium shadow-sm hover:shadow"
          >
            Manage Users
          </a>
        </div>
      </div>
    </div>
  );
}

