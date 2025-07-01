import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import { orderReducer } from './reducers/orderReducer';

export let store = configureStore({
    reducer: {
        auth: authReducer,
        order: orderReducer
    }
})