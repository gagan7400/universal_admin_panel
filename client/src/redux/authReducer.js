const initialState = {
    token: localStorage.getItem("adminToken") || null,
    loading: false,
    error: null,
    message: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_ADMIN_REQUEST':
        case 'FORGOT_PASSWORD_REQUEST':
        case 'RESET_PASSWORD_REQUEST':
            return { ...state, loading: true, error: null, message: null };

        case 'LOGIN_ADMIN_SUCCESS':
            return { ...state, loading: false, token: action.payload };

        case 'FORGOT_PASSWORD_SUCCESS':
        case 'RESET_PASSWORD_SUCCESS':
            return { ...state, loading: false, message: action.payload };

        case 'LOGIN_ADMIN_FAIL':
        case 'FORGOT_PASSWORD_FAIL':
        case 'RESET_PASSWORD_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'ADMIN_LOGOUT':
            return { ...state, token: null };

        default:
            return state;
    }
};
