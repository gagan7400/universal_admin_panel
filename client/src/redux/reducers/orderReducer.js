const initialState = {
    token: localStorage.getItem("adminToken") || null,
    loading: true,
    error: null,
    message: null,
    users: null,
    usercount: 0
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'COUNT_ORDERS_REQUEST':
            return { ...state, loading: true, error: null, usercount: 0 };
        case 'COUNT_ORDERS_SUCCESS':
            return { ...state, loading: false, usercount: action.payload, error: null };
        case 'COUNT_ORDERS_FAIL':
            return { ...state, usercount: 0, loading: false, error: action.payload };
        default:
            return state;
    }
};


