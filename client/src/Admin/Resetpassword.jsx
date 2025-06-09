import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../redux/actions/authActions';
 

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch = useDispatch();
    const { message, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword({ email, otp, newPassword }));
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
                <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" placeholder="OTP" required />
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New Password" required />
                <button type="submit">Reset Password</button>
                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
