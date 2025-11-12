import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/dashboard/Home';
import UsersList from '../pages/users/UsersList';
import UserCreate from '../pages/users/UserCreate';
import UserEdit from '../pages/users/UserEdit';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/users" element={<UsersList/>} />
          <Route path="/users/new" element={<UserCreate/>} />
          <Route path="/users/:id" element={<UserEdit/>} />
        </Route>
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

