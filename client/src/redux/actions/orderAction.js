import axios from 'axios';

const API = import.meta.env.VITE_API || "https://universal-admin-panel.onrender.com";

export const getAllOrders = () => async (dispatch) => {
    dispatch({ type: "GET_ORDERS_REQUEST" });
    try {
        const { data } = await axios.get(
            "https://universal-admin-panel.onrender.com/api/order/admin/orders",
            { withCredentials: true }
        );
        if (data.success) {
            dispatch({ type: "GET_ORDERS_SUCCESS", payload: data.data });
        } else {
            dispatch({ type: "GET_ORDERS_FAIL", payload: data.message });
        }
    } catch (err) {
        dispatch({ type: "GET_ORDERS_FAIL", payload: err?.response?.data?.message });
    }
};


export const countOrders = () => async (dispatch) => {
    dispatch({ type: "COUNT_ORDERS_REQUEST" });
    try {
        const { data } = await axios.get(
            "https://universal-admin-panel.onrender.com/api/order/admin/count-orders",
            { withCredentials: true }
        );
        if (data.success) {
            dispatch({ type: "COUNT_ORDERS_SUCCESS", payload: data.data });
        } else {
            dispatch({ type: "COUNT_ORDERS_FAIL", payload: data.message });
        }
    } catch (err) {
        dispatch({ type: "COUNT_ORDERS_FAIL", payload: err?.response?.data?.message });
    }
};

