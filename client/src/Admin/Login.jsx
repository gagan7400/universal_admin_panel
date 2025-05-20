import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../redux/authActions';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAdmin({ email, password }));
    };

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token]);

    return (

        <form onSubmit={handleSubmit} className='form'>
            <p className='form_text'>Welcome Back!!!</p>
            <h2 className='form_heading'>Login</h2>
            <span class="form-label">
                <input type="text" name="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label for="Email">Email</label>
            </span>

            <span class="form-label">
                <input type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label for="password">Password</label>
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
