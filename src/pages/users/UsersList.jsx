import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from '../../api/userApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function UsersList() {
  const { data = [], isLoading } = useGetUsersQuery();
  const [delUser] = useDeleteUserMutation();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await delUser(deleteId).unwrap();
        setDeleteId(null);
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  if (isLoading) return <div className="p-4">Loading…</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Users</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Manage your users</p>
        </div>
        <Link 
          to="/users/new" 
          className="bg-accent-500 text-white px-4 py-2 rounded-md hover:bg-accent-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 font-medium shadow-sm hover:shadow"
        >
          Create User
        </Link>
      </div>
      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="text-left p-4 font-semibold text-neutral-700 dark:text-neutral-300">Name</th>
              <th className="text-left p-4 font-semibold text-neutral-700 dark:text-neutral-300">Email</th>
              <th className="text-left p-4 font-semibold text-neutral-700 dark:text-neutral-300">Role</th>
              <th className="text-right p-4 font-semibold text-neutral-700 dark:text-neutral-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                  No users found
                </td>
              </tr>
            ) : (
              data.map(u => (
                <tr 
                  key={u.id} 
                  className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="p-4 text-neutral-900 dark:text-neutral-100 font-medium">{u.name}</td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">{u.email}</td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-md bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/users/${u.id}`} 
                        className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => setDeleteId(u.id)} 
                        className="px-3 py-1.5 border border-red-300 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}

