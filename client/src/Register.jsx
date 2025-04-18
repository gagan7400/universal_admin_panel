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
        <>
            {!step === 'register' ? (<>
                <div class="container">
                    <div class="title">
                        <p>Registration</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div class="user_details">
                            <div class="input_box">
                                <label for="firstName">FirstName</label>
                                <input name="firstName" onChange={handleChange} type="text" id="firstName" placeholder="Enter your FirstName" required />
                            </div>
                            <div class="input_box">
                                <label for="lastName">LastName</label>
                                <input name="lastName" onChange={handleChange} type="text" id="LastName" placeholder="Enter your LastName" required />
                            </div>

                            <div class="input_box">
                                <label for="email">Email</label>
                                <input name="email" onChange={handleChange} type="email" id="email" placeholder="Enter your email" required />
                            </div>
                            <div class="input_box">
                                <label for="phone">Phone Number</label>
                                <input name="phone" onChange={handleChange} type="number" id="phone" placeholder="Enter your number" required />
                            </div>
                            <div class="input_box">
                                <label for="password">Password</label>
                                <input name="password" onChange={handleChange} type="password" id="password" placeholder="Enter your password" required />
                            </div>
                            <div class="input_box">
                                <label for="applicationId">ApplicationId</label>
                                <input name="applicationId" onChange={handleChange} type="text" id="applicationId" placeholder="Please Enter Your ApplicationId" required />
                            </div>
                            <div class="input_box">
                                <label for="deviceType">DeviceType</label>
                                <input name="deviceType" onChange={handleChange} type="text" id="DeviceType" placeholder="Please Enter Your DeviceType" required />
                            </div>

                        </div>

                        <div class="reg_btn">
                            <input type="submit" value="Register" />
                        </div>
                    </form>
                </div>

            </>
            ) : (
                <div class="container">
                    <div class="title">
                        <p>Verify Otp</p>
                    </div>
                    <form onSubmit={handleVerifyOtp}>
                        <div class="verify_otp_box">
                            <div class="verify_input_box" style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", }}>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    name="VerifyOTP"
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                <button type="submit" >Verify</button>
                                <button type="button" onClick={handleResendOtp}> Resend OTP </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
};

export default Register;
