const initialState = {
  loading: false,
  error: null,
  message: null,
  isAuthenticated: false,
  users: null,
  admin: null,
  permissions: [],
  role: 'subadmin',
  usererror: null,
  userloading: true
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_ADMIN_REQUEST':
    case 'FORGOT_PASSWORD_REQUEST':
    case 'RESET_PASSWORD_REQUEST':
      return { ...state, loading: true, error: null };
    case 'GET_USER_REQUEST':
      return { ...state, userloading: true, usererror: null };
    case 'LOGIN_ADMIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        admin: action.payload,
        role: action.payload.role,
        permissions: action.payload.permissions || []
      };
    case 'GET_USER_SUCCESS':
      return { ...state, userloading: false, usererror: null, users: action.payload };
    case 'FORGOT_PASSWORD_SUCCESS':
    case 'RESET_PASSWORD_SUCCESS':
      return { ...state, loading: false, message: action.payload };
    case 'GET_USER_FAIL':
      return { ...state, userloading: false, usererror: action.payload };
    case 'LOGIN_ADMIN_FAIL':
    case 'FORGOT_PASSWORD_FAIL':
    case 'RESET_PASSWORD_FAIL':
      return {
        ...state,
        users: null,
        admin: null,
        permissions: [],
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'ADMIN_LOGOUT':
      return {
        ...state,
        admin: null,
        permissions: [],
        isAuthenticated: false,
        loading: false
      };
    default:
      return {...state ,  loading:false };
  }
};

