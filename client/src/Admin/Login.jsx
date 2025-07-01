import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../redux/actions/authActions';
import { Bounce, toast } from 'react-toastify';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAdmin(email, password, navigate));
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

                    <div className="text-center mt-5">
                        <NavLink to="/forgot-password" className="text-blue-600 hover:underline text-base">
                            Forgot your password?
                        </NavLink>
                    </div>
                </div>
            </div>


            {/* <div className="antialiased bg-gray-200 text-gray-900 font-sans">
                <div className="flex items-center h-screen w-full">
                    <div className="w-full bg-amber-300 text-blue-800 rounded shadow-lg p-8 sm:m-4  md:max-w-sm md:mx-auto xl:p-10  ">
                        <span className="block w-full text-2xl uppercase font-bold mb-4">Login</span>
                        <form className="mb-4" onSubmit={handleSubmit}>
                            <div className="mb-4 md:w-full">
                                <label htmlFor="email" className="block  text-blue-800 text-lg mb-1">Email</label>
                                <input className="w-full border-none rounded p-2 outline-none focus:border-blue-500 focus:border-2  focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Email" />
                            </div>
                            <div className="mb-6 md:w-full">
                                <label htmlFor="password" className="block text-blue-800  text-lg mb-1">Password</label>
                                <input className="w-full border-none rounded p-2 outline-none focus:border-blue-500 focus:border-2 focus:shadow-outline" type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="Password" />
                            </div>
                            <button type='submit' className="bg-green-500 hover:bg-green-700 text-white uppercase text-lg font-semibold px-4 py-2 rounded">Login</button>
                        </form>
                        <NavLink to="/forgot-password" className="text-blue-700 text-center text-lg">Forgot password?</NavLink>
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default Login;
