import { useFormik } from 'formik';
import * as yup from 'yup';
import { useCreateUserMutation } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const userSchema = yup.object({
  name: yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  role: yup.string().oneOf(['user', 'admin']).required('Role is required'),
});

export default function UserCreate() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: '', email: '', role: 'user' },
    validationSchema: userSchema,
    onSubmit: async (values, { setStatus }) => {
      try {
        await createUser(values).unwrap();
        navigate('/users');
      } catch {
        setStatus('Failed to create user');
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Create User</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Add a new user to the system</p>
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

