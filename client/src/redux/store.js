import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import { orderReducer } from './reducers/orderReducer';
import { userReducer } from './reducers/userReducer';
import { productReducer } from './reducers/productReducer';

export let store = configureStore({
    reducer: {
        auth: authReducer,
        order: orderReducer,
        user: userReducer,
        product: productReducer
    }
})