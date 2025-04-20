import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authReducer';

export let store = configureStore({
    reducer: {
        auth: authReducer
    }
})