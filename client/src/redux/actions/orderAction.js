import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:4000";

export const countorders = () => async (dispatch) => {
    console.log('order call')
    dispatch({ type: "COUNT_ORDERS_REQUEST" });
    try {
        const { data } = await axios.get(
            "http://localhost:4000/api/order/admin/total-orders",
            { withCredentials: true }
        );
        if (data.success) {
            console.log(data)
            dispatch({ type: "COUNT_ORDERS_SUCCESS", payload: data.data });
        } else {
            dispatch({ type: "COUNT_ORDERS_FAIL", payload: data.message });
        }
    } catch (err) {
        dispatch({ type: "COUNT_ORDERS_FAIL", payload: err?.response?.data?.message });
    }
};

