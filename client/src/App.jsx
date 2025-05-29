import './App.css'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Admin/Login';
import ForgotPassword from './Admin/ForgotPassword';
import ResetPassword from './Admin/Resetpassword';
import Dashboard from './Dashboard/Dashboard';
import DashboardComp from './Dashboard/DashboardComp.jsx';
import Products from './Dashboard/Products.jsx';
import Users from './Dashboard/Users.jsx';
import Orders from './Dashboard/Orders.jsx';
import ProtectedRoute from './protectedroute/ProtectedRoute.jsx';
import Loader from './layout/Loader';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAdmin } from './redux/authActions.js';
import Home from './Home.jsx';

function App() {
  const dispatch = useDispatch();
  let { error } = useSelector(state => state.auth)
  useEffect(() => {
    dispatch(loadAdmin()); // check auth on page load
  }, [dispatch]);
  useEffect(() => {
    toast.error(error, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }, [error])
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace={true} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /></ProtectedRoute>} >
          <Route path="/dashboard/" element={<DashboardComp />} > </Route>
          <Route path="/dashboard/users" element={<Users />} > </Route>
          <Route path="/dashboard/products" element={<Products />} > </Route>
          <Route path="/dashboard/orders" element={<Orders />} > </Route>
        </Route>
      </Routes>

    </>
  )
}

export default App


