import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';

export let store = configureStore({
    reducer: {
        auth: authReducer
    }
})