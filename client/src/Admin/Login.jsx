import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../redux/authActions';
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
                        <a className="text-blue-700 text-center text-sm" href="/login">Forgot password?</a>
                    </div>
                </div>
            </div>
            {/* <form onSubmit={handleSubmit} className='w-1/3 m-auto border mt-5 p-6 flex flex-col h-1/2 bg-amber-400'>
                <p className='form_text'>Welcome Back!!!</p>
                <h2 className='form_heading'>Login</h2>
                <span className="form-label">
                    <input type="email" name="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="Email">Email</label>
                </span>

                <span className="form-label">
                    <input type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="password">Password</label>
                </span>

                <button type="submit" className='submit_btn'>Login</button>
                {error && <p className='error_handler'>{error}</p>}
                <p className="suggest">
                    Don't have an account ? <a href="">Register</a>
                </p>
            </form> */}
        </>
    );
};

export default Login;
