import './App.css'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Admin/Login';
import ForgotPassword from './Admin/ForgotPassword';
import ResetPassword from './Admin/Resetpassword';
import Dashboard from './Dashboard/Dashboard';
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /></ProtectedRoute>} >
        </Route>
      </Routes>

    </>
  )
}

export default App


