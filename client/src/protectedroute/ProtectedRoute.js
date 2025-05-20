// ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { logout, loginSuccess, setAuthLoading } from '../redux/actions/adminloginaction';
import axios from 'axios';
import Loader from '../layout/Loader';

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, loading } = useSelector((state) => state.user);

    useEffect(() => {
        const checkAuth = async () => {
            dispatch(setAuthLoading());
            try {
                const { data } = await axios.get("http://localhost:4000/api/admin/profile", {
                    withCredentials: true,
                });

                if (data.success) {
                    dispatch(loginSuccess(data.admin));
                } else {
                    dispatch(logout());
                }
            } catch (error) {
                dispatch(logout());
            }
        };

        checkAuth();
    }, [dispatch]);

    if (loading) return <Loader />;

    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

    return children;
};

export default ProtectedRoute;