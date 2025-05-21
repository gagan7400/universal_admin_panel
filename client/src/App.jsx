import './App.css'
import { Bounce, ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Admin/Login';
import ForgotPassword from './Admin/ForgotPassword';
import ResetPassword from './Admin/Resetpassword';
import Dashboard from './Dashboard/Dashboard';
import ProtectedRoute from './protectedroute/ProtectedRoute';
import Loader from './layout/Loader';
function App() {
  return (
    <>
      <Loader />
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /></ProtectedRoute>} >
          </Route>
        </Routes>
      </Router >
    </>
  )
}

export default App


