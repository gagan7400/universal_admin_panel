import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:4000";

export const getAllUsers = () => async (dispatch) => {
    dispatch({ type: "GET_USER_REQUEST" });
    try {
        const { data } = await axios.get(
            "http://localhost:4000/api/user/getallusers",
            { withCredentials: true }
        );
        if (data.status) {
            dispatch({ type: "GET_USER_SUCCESS", payload: data.data });
        } else {
            dispatch({ type: "GET_USER_FAIL", payload: data.message });
        }
    } catch (err) {
        dispatch({ type: "GET_USER_FAIL", payload: err?.response?.data?.message });
    }
};


export const countUsers = () => async (dispatch) => {
    dispatch({ type: "COUNT_USER_REQUEST" });
    try {
        const { data } = await axios.get(
            "http://localhost:4000/api/user/count-users",
            { withCredentials: true }
        );
        if (data.status) {
            dispatch({ type: "COUNT_USER_SUCCESS", payload: data.data });
        } else {
            dispatch({ type: "COUNT_USER_FAIL", payload: data.message });
        }
    } catch (err) {
        dispatch({ type: "COUNT_USER_FAIL", payload: err?.response?.data?.message });
    }
};

