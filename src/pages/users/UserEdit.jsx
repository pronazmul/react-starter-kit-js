import { useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useUpdateUserMutation, useGetUserQuery } from '../../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const userSchema = yup.object({
  name: yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  role: yup.string().oneOf(['user', 'admin']).required('Role is required'),
});

export default function UserEdit() {
  const { id } = useParams();
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(id);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const navigate = useNavigate();
  const initialValues = useMemo(
    () => ({ name: user?.name || '', email: user?.email || '', role: user?.role || 'user' }),
    [user]
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: userSchema,
    onSubmit: async (values, { setStatus }) => {
      try {
        await updateUser({ id, ...values }).unwrap();
        navigate('/users');
      } catch {
        setStatus('Failed to update user');
      }
    },
  });

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
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <Input
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500">{formik.errors.name}</p>}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.email && formik.errors.email && <p className="text-xs text-red-500">{formik.errors.email}</p>}
          <Select
            label="Role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          {formik.touched.role && formik.errors.role && <p className="text-xs text-red-500">{formik.errors.role}</p>}
          {formik.status && <p className="text-sm text-red-500">{formik.status}</p>}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={isLoading || !formik.isValid}>
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

