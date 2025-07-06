// Required Libraries
import React, { useState } from 'react';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/api/user/registration', formData);
            toast.success(res.data.message, {
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
            setStep('verify');
        } catch (err) {
            toast.error(err.message, {
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
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/api/user/verify-otp', {
                email: formData.email,
                otp,
            });
            toast.success(res.data.message, {
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
        } catch (err) {
            toast.error(err.response?.data?.message || 'OTP verification failed', {
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

        }
    };

    const handleResendOtp = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/user/resend-otp', {
                email: formData.email,
            });
            toast.success(res.data.message, {
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
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP', {
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
        }
    };

    return (
        <>
            {step === 'register' ? (<>
                <div className="container">
                    <div className="title">
                        <p>Registration</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="user_details">
                            <div className="input_box">
                                <label htmlFor="firstName">FirstName</label>
                                <input name="firstName" onChange={handleChange} type="text" id="firstName" placeholder="Enter your FirstName" required />
                            </div>
                            <div className="input_box">
                                <label htmlFor="lastName">LastName</label>
                                <input name="lastName" onChange={handleChange} type="text" id="LastName" placeholder="Enter your LastName" required />
                            </div>

                            <div className="input_box">
                                <label htmlFor="email">Email</label>
                                <input name="email" onChange={handleChange} type="email" id="email" placeholder="Enter your email" required />
                            </div>
                            <div className="input_box">
                                <label htmlFor="phone">Phone Number</label>
                                <input name="phone" onChange={handleChange} type="number" id="phone" placeholder="Enter your number" required />
                            </div>
                            <div className="input_box">
                                <label htmlFor="password">Password</label>
                                <input name="password" onChange={handleChange} type="password" id="password" placeholder="Enter your password" required />
                            </div>
                            <div className="input_box">
                                <label htmlFor="applicationId">ApplicationId</label>
                                <input name="applicationId" onChange={handleChange} type="text" id="applicationId" placeholder="Please Enter Your ApplicationId" required />
                            </div>
                            <div className="input_box">
                                <label htmlFor="deviceType">DeviceType</label>
                                <input name="deviceType" onChange={handleChange} type="text" id="DeviceType" placeholder="Please Enter Your DeviceType" required />
                            </div>

                        </div>

                        <div className="reg_btn">
                            <input type="submit" value="Register" />
                        </div>
                    </form>
                </div>

            </>
            ) : (
                <div className="container">
                    <div className="title">
                        <p>Verify Otp</p>
                    </div>
                    <form onSubmit={handleVerifyOtp}>
                        <div className="verify_otp_box">
                            <div className="verify_input_box" style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", }}>
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
        </>
    );
};

export default Register;
