import './App.css';
import { Bounce, ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './Admin/Login';
import ForgotPassword from './Admin/ForgotPassword';
import ResetPassword from './Admin/Resetpassword';
import Dashboard from './Dashboard/Dashboard';
import DashboardComp from './Dashboard/DashboardComp.jsx';
import Products from './Dashboard/Products.jsx';
import Users from './Dashboard/Users.jsx';
import SubAdmins from './Dashboard/SubAdmins.jsx';
import Orders from './Dashboard/Orders.jsx';
import ProtectedRoute from './protectedroute/ProtectedRoute.jsx';
import NewProduct from './Dashboard/NewProduct.jsx';
import SubadminLogin from './Admin/SubadminLogin.jsx';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subadmin/login" element={<SubadminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'subadmin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          <Route path="" element={<DashboardComp />} />

          {/* Users - admin only OR subadmin with permission */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['admin', 'subadmin']} requiredPermission="users">
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Products */}
          <Route
            path="products"
            element={
              <ProtectedRoute allowedRoles={['admin', 'subadmin']} requiredPermission="products">
                <Products />
              </ProtectedRoute>
            }
          />

          {/* Add Product */}
          <Route
            path="product/new"
            element={
              <ProtectedRoute allowedRoles={['admin', 'subadmin']} requiredPermission="add_product">
                <NewProduct />
              </ProtectedRoute>
            }
          />

          {/* Orders */}
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={['admin', 'subadmin']} requiredPermission="orders">
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Subadmin Manager - Admin Only */}
          <Route
            path="sub-admins"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SubAdmins />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;

import './App.css'
import { Bounce, ToastContainer, } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Admin/Login';
import ForgotPassword from './Admin/ForgotPassword';
import ResetPassword from './Admin/Resetpassword';
import Dashboard from './Dashboard/Dashboard';
import DashboardComp from './Dashboard/DashboardComp.jsx';
import Products from './Dashboard/Products.jsx';
import Users from './Dashboard/Users.jsx';
import SubAdmins from './Dashboard/SubAdmins.jsx';
import Orders from './Dashboard/Orders.jsx';
import ProtectedRoute from './protectedroute/ProtectedRoute.jsx';
import NewProduct from './Dashboard/NewProduct.jsx';
import SubadminLogin from './Admin/SubadminLogin.jsx';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace={true} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subadmin/login" element={<SubadminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /></ProtectedRoute>} >
          <Route path="/dashboard/" element={<DashboardComp />} > </Route>
          <Route path="/dashboard/users" element={<Users />} > </Route>
          <Route path="/dashboard/products" element={<Products />} > </Route>
          {/* <Route path="/dashboard/product" element={<NewProduct />} > </Route> */}
          <Route path="/dashboard/sub-admins" element={<SubAdmins />} > </Route>
          <Route path="/dashboard/orders" element={<Orders />} > </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App


