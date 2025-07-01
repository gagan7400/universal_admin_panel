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
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center font-sans antialiased text-gray-900">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transition-all duration-300 ease-in-out">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-800 mb-6 uppercase">Reset Password</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-blue-800 text-sm font-semibold mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Username or Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="otp" className="block text-blue-800 text-sm font-semibold mb-1">OTP</label>
                        <input
                            id="otp"
                            type="number"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter your OTP"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-blue-800 text-sm font-semibold mb-1">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 uppercase"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>

        // <div className="antialiased bg-gray-200 text-gray-900 font-sans">
        //     <div className="flex items-center h-screen w-full">
        //         <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
        //             <span className="block w-full text-xl uppercase font-bold mb-4">Reset Password</span>
        //             <form className="mb-4" onSubmit={handleSubmit}>
        //                 <div className="mb-4 md:w-full">
        //                     <label htmlFor="email" className="block text-xs mb-1">Email</label>
        //                     <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Username or Email" />
        //                 </div>
        //                 <div className="mb-4 md:w-full">
        //                     <label htmlFor="otp" className="block text-xs mb-1">Otp</label>
        //                     <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={otp} onChange={(e) => setOtp(e.target.value)} type="number" name="otp" id="Otp" placeholder="Enter Your Otp" />
        //                 </div>
        //                 <div className="mb-4 md:w-full">
        //                     <label htmlFor="newPassword" className="block text-xs mb-1">newPassword</label>
        //                     <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" name="newPassword" id="newPassword" placeholder="New Password" />
        //                 </div>
        //                 <button type='submit' className="bg-green-500 hover:bg-green-700 text-white uppercase text-sm font-semibold px-4 py-2 rounded">Reset Password</button>
        //             </form>
        //         </div>
        //     </div>
        // </div>
    );
};

export default ResetPassword;
