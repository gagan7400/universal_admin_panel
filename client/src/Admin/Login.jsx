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
            <div className="antialiased bg-gray-200 text-gray-900 font-sans">
                <div className="flex items-center h-screen w-full">
                    <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
                        <span className="block w-full text-xl uppercase font-bold mb-4">Login</span>
                        <form className="mb-4" onSubmit={handleSubmit}>
                            <div className="mb-4 md:w-full">
                                <label htmlFor="email" className="block text-xs mb-1">Username or Email</label>
                                <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Username or Email" />
                            </div>
                            <div className="mb-6 md:w-full">
                                <label htmlFor="password" className="block text-xs mb-1">Password</label>
                                <input className="w-full border rounded p-2 outline-none focus:shadow-outline" type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="Password" />
                            </div>
                            <button type='submit' className="bg-green-500 hover:bg-green-700 text-white uppercase text-sm font-semibold px-4 py-2 rounded">Login</button>
                        </form>
                        <NavLink to="/forgot-password" className="text-blue-700 text-center text-sm" href="/login">Forgot password?</NavLink>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
