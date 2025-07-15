// ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { loadAdmin } from '../redux/actions/authActions.js';
import axios from 'axios';
import Loader from '../layout/Loader.jsx';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, loading, admin } = useSelector((state) => state.auth);

    useEffect(() => {
        loadAdmin()
    }, [dispatch]);

    if (loading) return <Loader />;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Role-based restriction
    if (allowedRoles.length > 0 && !allowedRoles.includes(admin?.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
