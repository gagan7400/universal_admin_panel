import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:4000";

// LOGIN ACTION
export const loginAdmin = (data) => async (dispatch) => {
  dispatch({ type: 'LOGIN_ADMIN_REQUEST' });
  try {
    const res = await axios.post(`${API}/api/admin/login`, data);
    const token = res.data.token;
    localStorage.setItem("adminToken", token);
    dispatch({ type: 'LOGIN_ADMIN_SUCCESS', payload: token });
  } catch (err) {
    dispatch({
      type: 'LOGIN_ADMIN_FAIL',
      payload: err.response?.data?.message || err.message,
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: 'FORGOT_PASSWORD_REQUEST' });
  try {
    const res = await axios.post(`${API}/api/admin/forgot-password`, { email });
    dispatch({ type: 'FORGOT_PASSWORD_SUCCESS', payload: res.data.message });
  } catch (err) {
    dispatch({
      type: 'FORGOT_PASSWORD_FAIL',
      payload: err.response?.data?.message || err.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = (data) => async (dispatch) => {
  dispatch({ type: 'RESET_PASSWORD_REQUEST' });
  try {
    const res = await axios.post(`${API}/api/admin/reset-password`, data);
    dispatch({ type: 'RESET_PASSWORD_SUCCESS', payload: res.data.message });
  } catch (err) {
    dispatch({
      type: 'RESET_PASSWORD_FAIL',
      payload: err.response?.data?.message || err.message,
    });
  }
};

// LOGOUT
export const logoutAdmin = () => (dispatch) => {
  localStorage.removeItem("adminToken");
  dispatch({ type: 'ADMIN_LOGOUT' });
};
