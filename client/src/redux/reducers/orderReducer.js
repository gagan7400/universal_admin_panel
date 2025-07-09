const initialState = {
    loading: true,
    error: null,
    message: null,
    allorders: null,
    ordercount: 0
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'COUNT_ORDERS_REQUEST':
        case 'GET_ORDERS_REQUEST':
            return { ...state, loading: true, error: null, };
        case 'GET_ORDERS_SUCCESS':
            return { ...state, loading: false, error: null, allorders: action.payload };
        case 'COUNT_ORDERS_SUCCESS':
            return { ...state, loading: false, ordercount: action.payload, error: null };
        case 'GET_ORDERS_FAIL':
            return { ...state, loading: false, error: action.payload, allorders: null };
        case 'COUNT_ORDERS_FAIL':
            return { ...state, ordercount: 0, loading: false, error: action.payload };
        default:
            return state;
    }
};


