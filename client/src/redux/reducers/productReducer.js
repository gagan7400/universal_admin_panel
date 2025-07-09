const initialState = {
    loading: true,
    error: null,
    message: null,
    allproducts: null,
    productcount: 0
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'COUNT_PRODUCT_REQUEST':
        case 'GET_PRODUCT_REQUEST':
            return { ...state, loading: true, error: null, };
        case 'GET_PRODUCT_SUCCESS':
            return { ...state, loading: false, error: null, allproducts: action.payload };
        case 'COUNT_PRODUCT_SUCCESS':
            return { ...state, loading: false, productcount: action.payload, error: null };
        case 'GET_PRODUCT_FAIL':
            return { ...state, loading: false, error: action.payload, allproducts: null };
        case 'COUNT_PRODUCT_FAIL':
            return { ...state, productcount: 0, loading: false, error: action.payload };
        default:
            return state;
    }
};


