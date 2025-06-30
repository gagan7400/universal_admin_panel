import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';


const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword({ email, otp, newPassword }, navigate));
    };

    return (
        <div className="antialiased bg-gray-200 text-gray-900 font-sans">
            <div className="flex items-center h-screen w-full">
                <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
                    <span className="block w-full text-xl uppercase font-bold mb-4">Reset Password</span>
                    <form className="mb-4" onSubmit={handleSubmit}>
                        <div className="mb-4 md:w-full">
                            <label htmlFor="email" className="block text-xs mb-1">Email</label>
                            <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Username or Email" />
                        </div>
                        <div className="mb-4 md:w-full">
                            <label htmlFor="otp" className="block text-xs mb-1">Otp</label>
                            <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={otp} onChange={(e) => setOtp(e.target.value)} type="number" name="otp" id="Otp" placeholder="Enter Your Otp" />
                        </div>
                        <div className="mb-4 md:w-full">
                            <label htmlFor="newPassword" className="block text-xs mb-1">newPassword</label>
                            <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" name="newPassword" id="newPassword" placeholder="New Password" />
                        </div>
                        <button type='submit' className="bg-green-500 hover:bg-green-700 text-white uppercase text-sm font-semibold px-4 py-2 rounded">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
