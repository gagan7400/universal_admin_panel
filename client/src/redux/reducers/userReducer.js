const initialState = {
    loading: true,
    error: null,
    message: null,
    users: [],
    usercount: 0
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'COUNT_USER_REQUEST':
        case 'GET_USER_REQUEST':
            return { ...state, loading: true, error: null, };
        case 'GET_USER_SUCCESS':
            return { ...state, loading: false, error: null, users: action.payload };
        case 'COUNT_USER_SUCCESS':
            return { ...state, loading: false, usercount: action.payload, error: null };
        case 'GET_USER_FAIL':
            return { ...state, loading: false, error: action.payload, users: null };
        case 'COUNT_USER_FAIL':
            return { ...state, usercount: 0, loading: false, error: action.payload };
        default:
            return state;
    }
};


