import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:4000";

export const setAuthLoading = () => ({
  type: "LOGIN_ADMIN_REQUEST"
});

export const loginSuccess = (admin) => ({
  type: "LOGIN_ADMIN_SUCCESS",
  payload: admin
});
// LOGIN ACTION
export const loginAdmin = (email, password, navigate) => async (dispatch) => {
  dispatch({ type: "LOGIN_ADMIN_REQUEST" });
  try {
    const res = await axios.post(
      "http://localhost:4000/api/admin/login",
      { email, password },
      { withCredentials: true }
    );

    const profileRes = await axios.get("http://localhost:4000/api/admin/profile", {
      withCredentials: true, credentials: 'include'
    });

    if (profileRes.data.success) {
      console.log(profileRes.data.data)
      dispatch({ type: "LOGIN_ADMIN_SUCCESS", payload: profileRes.data.data });
      navigate("/dashboard");
    } else {
      dispatch({ type: "LOGIN_ADMIN_FAIL", payload: "Unable to fetch profile" });
    }
  } catch (err) {
    console.log(err)
    dispatch({ type: "LOGIN_ADMIN_FAIL", payload: err.message });
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

export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API}/api/admin/logout`, { withCredentials: true });
    dispatch({ type: "ADMIN_LOGOUT" });
  } catch (err) {
    console.log(err)
    dispatch({ type: "LOGIN_ADMIN_FAIL", payload: err.message });
  }
};

export const loadAdmin = () => async (dispatch) => {


  dispatch({ type: "LOGIN_ADMIN_REQUEST" }); // ✅ Start loading
  try {
    const { data } = await axios.get("http://localhost:4000/api/admin/profile", { withCredentials: true });
    if (data.success) {
      dispatch(loginSuccess(data.admin));
    } else {
      dispatch(logout());
    }
  } catch (err) {
    dispatch(logout());
  }
};
