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
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit} className='form'>
                <div className='from_control'>
                    <label htmlFor="Email" className='form_label'>Email</label>
                    <input value={email} className='from_input' onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
                </div>
                <div className='from_control'>
                    <label htmlFor="password" className='form_label'>Password</label>
                    <input value={password} className='from_input' onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
                </div>

                <button type="submit" className='submit_btn'>Login</button>
                {error && <p className='error_handler'>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
