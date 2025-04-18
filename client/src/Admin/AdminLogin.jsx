import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
    const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
    const [step, setStep] = useState('login');
    const [tempToken, setTempToken] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleLogin = async () => {
        try {
            const { data } = await axios.post('http://localhost:4000/api/admin/login', form);
            if (data.requires2FA) {
                setTempToken(data.tempToken);
                setStep('2fa');
            } else {
                localStorage.setItem('adminToken', data.token);
                alert('Login successful');
            }
        } catch (err) {
            alert(err.response.data.message);
        }
    };
    const handle2FAVerify = async () => {
        try {
            const { data } = await axios.post('http://localhost:4000/api/admin/2fa', {
                token: tempToken,
                twoFactorCode,
            });
            localStorage.setItem('adminToken', data.token);
            alert('2FA Verified. Logged in!');
        } catch (err) {
            alert('Invalid 2FA code');
        }
    };

    return (
        <div>
            {step === 'login' ? (
                <>
                    <input name="email" placeholder="Email" id='email' onChange={handleChange} />
                    <input name="password" id="password" placeholder="Password" type="password" onChange={handleChange} />
                    <label>
                        <input type="checkbox" name="rememberMe" onChange={handleChange} /> Remember Me
                    </label>
                    <button onClick={handleLogin}>Login</button>
                    <a href="/forgot-password">Forgot Password?</a>
                </>
            ) : (
                <>
                    <h4>Enter your 2FA Code</h4>
                    <input value={twoFactorCode} onChange={e => setTwoFactorCode(e.target.value)} />
                    <button onClick={handle2FAVerify}>Verify</button>
                </>
            )}
        </div>
    );
};

export default AdminLogin;
