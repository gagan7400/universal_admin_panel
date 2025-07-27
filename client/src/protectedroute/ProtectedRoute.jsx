import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, } from 'react-router-dom';
import Loader from '../layout/Loader.jsx';
import { loadAdmin, } from '../redux/actions/authActions.js';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, admin, authChecked } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadAdmin())
    }, [dispatch]);

    if (!authChecked || loading) return <div className='w-[100%] h-[100vh] flex justify-center items-center'><Loader /></div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    };

    // Role-based restriction 
    if (allowedRoles.length > 0 && !allowedRoles.includes(admin?.role)) {
        toast.error("you are not allowed to this route");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
