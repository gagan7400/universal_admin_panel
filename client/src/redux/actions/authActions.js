import axios from 'axios';
const API = import.meta.env.VITE_API || "http://localhost:4000";

export const setAuthLoading = () => ({ type: "LOGIN_ADMIN_REQUEST" });

export const loginSuccess = (admin) => ({
  type: "LOGIN_ADMIN_SUCCESS",
  payload: admin
});

export const loginAdmin = (email, password, navigate) => async (dispatch) => {
  dispatch(setAuthLoading());
  try {
    await axios.post(`${API}/api/admin/login`, { email, password }, { withCredentials: true });
    const { data } = await axios.get(`${API}/api/admin/profile`, { withCredentials: true });
    if (data.success) {
      dispatch(loginSuccess(data.data));
      navigate("/dashboard");
    } else {
      dispatch({ type: "LOGIN_ADMIN_FAIL", payload: data.message });
    }
  } catch (err) {
    dispatch({ type: "LOGIN_ADMIN_FAIL", payload: err?.response?.data?.message });
  }
};

export const loginSubAdmin = (email, password, navigate) => async (dispatch) => {
  dispatch(setAuthLoading());
  try {
    await axios.post(`${API}/api/admin/subadmin/login`, { email, password }, { withCredentials: true });
    const { data } = await axios.get(`${API}/api/admin/subadmin/profile`, { withCredentials: true });
    if (data.success) {
      dispatch(loginSuccess(data.data));
      navigate("/dashboard");
    } else {
      dispatch({ type: "LOGIN_ADMIN_FAIL", payload: data.message });
    }
  } catch (err) {
    dispatch({ type: "LOGIN_ADMIN_FAIL", payload: err?.response?.data?.message });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${API}/api/admin/logout`, { withCredentials: true });
    dispatch({ type: "ADMIN_LOGOUT" });
  } catch (err) {
    dispatch({ type: "LOGIN_ADMIN_FAIL", payload: err.message });
  }
};
export const logoutSubadmin = () => async (dispatch) => {
  try {
    await axios.get(`${API}/api/admin/logout`, { withCredentials: true });
    dispatch({ type: "ADMIN_LOGOUT" });
  } catch (err) {
    dispatch({ type: "LOGIN_ADMIN_FAIL", payload: err.message });
  }
};

export const loadAdmin = () => async (dispatch) => {
  dispatch(setAuthLoading());
  try {
    const { data } = await axios.get(`${API}/api/admin/profile`, { withCredentials: true });
    if (data.success) {
      dispatch(loginSuccess(data.data));
    } else {
      dispatch(logout());
    }
  } catch (err) {
    dispatch(logout());
  }
};
export const loadSubAdmin = () => async (dispatch) => {
  dispatch(setAuthLoading());
  try {
    const { data } = await axios.get(`${API}/api/admin/subadmin/profile`, { withCredentials: true });
    if (data.success) {
      dispatch(loginSuccess(data.data));
    } else {
      dispatch(logout());
    }
  } catch (err) {
    dispatch(logout());
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch({ type: "GET_USER_REQUEST" });
  try {
    const { data } = await axios.get(`${API}/api/user/getallusers`, { withCredentials: true });
    if (data.success) {
      dispatch({ type: "GET_USER_SUCCESS", payload: data.data });
    } else {
      dispatch({ type: "GET_USER_FAIL", payload: data.message });
    }
  } catch (err) {
    dispatch({ type: "GET_USER_FAIL", payload: err?.response?.data?.message });
  }
};
// // FORGOT PASSWORD
export const forgotPassword = (email, navigate) => async (dispatch) => {
  dispatch({ type: 'FORGOT_PASSWORD_REQUEST' });
  try {

    const res = await axios.post(`${API}/api/admin/forgot-password`, { email });
    if (res.data.success) {
      navigate("/reset-password")
    }
    dispatch({ type: 'FORGOT_PASSWORD_SUCCESS', payload: res.data.message });
  } catch (err) {
    dispatch({
      type: 'FORGOT_PASSWORD_FAIL',
      payload: err.response?.data?.message || err.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = (data, navigate) => async (dispatch) => {
  dispatch({ type: 'RESET_PASSWORD_REQUEST' });
  try {
    const res = await axios.post(`${API}/api/admin/reset-password`, data);
    if (res.data.success) {
      navigate("/login")
    }
    dispatch({ type: 'RESET_PASSWORD_SUCCESS', payload: res.data.message });
  } catch (err) {
    dispatch({
      type: 'RESET_PASSWORD_FAIL',
      payload: err.response?.data?.message || err.message,
    });
  }
};

