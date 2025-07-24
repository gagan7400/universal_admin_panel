import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
// import { loadAdmin } from '../redux/actions/authActions.js';
import axios from 'axios';
import Loader from '../layout/Loader.jsx';
import { loadAdmin, loginSuccess, logout, setAuthLoading, } from '../redux/actions/authActions.js';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, loading, admin, authChecked } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('eff')
        dispatch(loadAdmin())
    }, [dispatch]);

    if (!authChecked || loading) return <div className='w-[100%] h-[100vh] flex justify-center items-center'><Loader /></div>;

    if (!isAuthenticated) {
        console.log("thisss", isAuthenticated)
        return <Navigate to="/login" replace />
    };

    // // Role-based restriction 
    if (allowedRoles.length > 0 && !allowedRoles.includes(admin?.role)) {
        toast.error("you are not allowed to this route");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
