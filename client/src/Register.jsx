// Required Libraries
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        applicationId: '',
        deviceType: '',
    });

    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('register'); // 'register' | 'verify'
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        console.log(formData)
        try {
            const res = await axios.post('http://localhost:4000/api/user/registration', formData);
            console.log(res)
            setMessage(res.data.message);
            setStep('verify');
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post('http://localhost:4000/api/user/verify-otp', {
                email: formData.email,
                otp,
            });
            setMessage(res.data.message);
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || 'OTP verification failed');
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setMessage('');
        try {
            const res = await axios.post('http://localhost:4000/api/user/resend-otp', {
                email: formData.email,
            });
            setMessage(res.data.message);
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
            {step === 'register' ? (
                <form onSubmit={handleRegister}>
                    <h2>Register</h2>
                    <input name="firstName" placeholder="First Name" onChange={handleChange} required />
                    <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input name="phone" placeholder="Phone" onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <input name="applicationId" placeholder="Application ID" onChange={handleChange} required />
                    <input name="deviceType" placeholder="Device Type" onChange={handleChange} required />
                    <button type="submit">Register</button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp}>
                    <h2>Verify OTP</h2>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit">Verify</button>
                    <button type="button" onClick={handleResendOtp}>
                        Resend OTP
                    </button>
                </form>
            )}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;
