const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    applicationId: String,
    deviceType: String,
    otp: Number,
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    forgotPasswordOtp: Number,
    forgotPasswordOtpDateTime: String,
});

module.exports = mongoose.model('User', userSchema);
