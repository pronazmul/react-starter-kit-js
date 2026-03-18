import { useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useGetTodoQuery, useUpdateTodoMutation } from '../../api/todoApi';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const todoSchema = yup.object({
  title: yup.string().trim().min(2, 'Title must be at least 2 characters').required('Title is required'),
  description: yup.string().trim().max(300, 'Description can be up to 300 characters'),
  completed: yup.boolean().required(),
});

export default function TodoEdit() {
  const { id } = useParams();
  const { data: todo, isLoading: loadingTodo } = useGetTodoQuery(id);
  const [updateTodo, { isLoading }] = useUpdateTodoMutation();
  const navigate = useNavigate();
  const initialValues = useMemo(
    () => ({ title: todo?.title || '', description: todo?.description || '', completed: !!todo?.completed }),
    [todo]
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: todoSchema,
    onSubmit: async (values, { setStatus }) => {
      try {
        await updateTodo({ id, ...values }).unwrap();
        navigate('/todos');
      } catch {
        setStatus('Failed to update todo');
      }
    },
  });

  if (loadingTodo) return <div className="p-4">Loading...</div>;
  if (!todo) return <div className="p-4">Todo not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Todo</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input name="title" label="Title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        {formik.touched.title && formik.errors.title && <p className="text-xs text-red-500">{formik.errors.title}</p>}
        <Input name="description" label="Description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        {formik.touched.description && formik.errors.description && <p className="text-xs text-red-500">{formik.errors.description}</p>}
        <label className="flex items-center gap-2">
          <input type="checkbox" name="completed" checked={formik.values.completed} onChange={formik.handleChange} />
          Completed
        </label>
        {formik.status && <p className="text-sm text-red-500">{formik.status}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading || !formik.isValid}>{isLoading ? 'Updating...' : 'Update Todo'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/todos')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
