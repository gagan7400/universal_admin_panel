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
    role: { type: String, default: 'user' },
    image: { filename: String, url: String },
    address: [{
        fullName: { type: String, required: true },
        mobileNumber: { type: Number, required: true },
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false },
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
