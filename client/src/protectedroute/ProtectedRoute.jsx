import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
// import { loadAdmin } from '../redux/actions/authActions.js';
import axios from 'axios';
import Loader from '../layout/Loader.jsx';
import { loginSuccess, logout, setAuthLoading } from '../redux/actions/authActions.js';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, loading, admin } = useSelector((state) => state.auth);

console.log("protectroute")
    useEffect(() => {
        const checkAuth = async () => {
            dispatch(setAuthLoading());
            try {
                const { data } = await axios.get("https://universal-admin-panel.onrender.com/api/admin/profile", {
                    withCredentials: true,
                });
                if (data.success) {
                    dispatch(loginSuccess(data.data));
                } else {
                    console.log("console wala else logut out ", data)
                    dispatch(logout());
                }
            } catch (error) {
                console.log("catch wala else logut out ", error)
                dispatch(logout());
            }
        };
        checkAuth()
    }, [dispatch]);


    if (loading) return <Loader />;
    console.log(isAuthenticated ,admin)
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // // Role-based restriction 
    if (allowedRoles.length > 0 && !allowedRoles.includes(admin?.role)) {
        toast.error("you are not allowed to this route");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
