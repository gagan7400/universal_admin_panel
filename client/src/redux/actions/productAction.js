import axios from 'axios';

const API = import.meta.env.VITE_API 

export const getAllProducts = () => async (dispatch) => {
    dispatch({ type: "GET_PRODUCT_REQUEST" });
    try {
        const { data } = await axios.get(
            `${API}/api/product/all`,
            { withCredentials: true }
        );
        if (data.success) {
            dispatch({ type: "GET_PRODUCT_SUCCESS", payload: data.data });
        } else {
            dispatch({ type: "GET_PRODUCT_FAIL", payload: data.message });
        }
    } catch (err) {
        dispatch({ type: "GET_PRODUCT_FAIL", payload: err?.response?.data?.message });
    }
};


export const countProducts = () => async (dispatch) => {
    dispatch({ type: "COUNT_PRODUCT_REQUEST" });
    try {
        const { data } = await axios.get(
            `${API}/api/product/count-products`,
            { withCredentials: true }
        );
        if (data.success) {
            dispatch({ type: "COUNT_PRODUCT_SUCCESS", payload: data.data });
        } else {
            dispatch({ type: "COUNT_PRODUCT_FAIL", payload: data.message });
        }
    } catch (err) {
        dispatch({ type: "COUNT_PRODUCT_FAIL", payload: err?.response?.data?.message });
    }
};

