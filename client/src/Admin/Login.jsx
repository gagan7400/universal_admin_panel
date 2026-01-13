import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../redux/actions/authActions';
import { Bounce, toast } from 'react-toastify';
import './loaderlogin.css'
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, error, loading } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAdmin(email, password, navigate));
    };

    useEffect(() => {
        toast.error(error, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }, [error])
    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center font-sans antialiased text-gray-900">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transition-all duration-300 ease-in-out">
                    <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-blue-800 text-lg font-medium mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete='off'
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-blue-800 text-lg font-medium mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete='off'
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-3 bg-gradient-to-r bg-[var(--blue)] text-white   hover:bg-blue-900 hover:text-blue-50 text-lg font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        >
                            {loading && <div className="loaderlogin "></div>}
                            Login
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        <NavLink to="/forgot-password" className="l text-blue-600 hover:underline text-base">
                            Forgot your password ?
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
