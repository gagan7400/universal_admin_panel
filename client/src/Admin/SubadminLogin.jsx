import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginSubAdmin } from '../redux/actions/authActions';
import { Bounce, toast } from 'react-toastify';
const SubadminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginSubAdmin(email, password, navigate));
    };

    useEffect(() => {
        console.log("error", error)
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
                    <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">SubAdmin Login</h2>

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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-lg font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SubadminLogin;
