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
        <form onSubmit={handleSubmit} className='form'>
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
        </form>

    );
};

export default Login;
