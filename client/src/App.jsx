import React, { Suspense } from 'react';
import './App.css'
import { Bounce, ToastContainer, } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './protectedroute/ProtectedRoute.jsx';
import Loader from './layout/Loader.jsx';

const Login = React.lazy(() => import('./Admin/Login'));
const ForgotPassword = React.lazy(() => import('./Admin/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./Admin/Resetpassword'));
const Dashboard = React.lazy(() => import('./Dashboard/Dashboard'));
const DashboardComp = React.lazy(() => import('./Dashboard/DashboardComp.jsx'));
const Products = React.lazy(() => import('./Dashboard/Products.jsx'));
const Users = React.lazy(() => import('./Dashboard/Users.jsx'));
const SubAdmins = React.lazy(() => import('./Dashboard/SubAdmins.jsx'));
const Orders = React.lazy(() => import('./Dashboard/Orders.jsx'));

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
      <Suspense fallback={<div className="w-full h-screen flex justify-center items-center"><Loader /></div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace={true} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'subadmin']} > <Dashboard /></ProtectedRoute>} >
            <Route path="/dashboard/" element={<DashboardComp />} > </Route>
            <Route path="/dashboard/users" element={<Users />} > </Route>
            <Route path="/dashboard/products" element={<Products />} > </Route>
            <Route path="/dashboard/sub-admins" element={<SubAdmins />} > </Route>
            <Route path="/dashboard/orders" element={<Orders />} > </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App



