let Admin = require("../models/Admin.js");
let bcrypt = require("bcryptjs");
let nodemailer = require("nodemailer");
let jwt = require("jsonwebtoken");

const generateToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};


const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ msg: "Admin already exists" });

        const hashed = await bcrypt.hash(password, 12);
        const admin = await Admin.create({ email, password: hashed });

        const token = generateToken(admin._id);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(400).json({ msg: "Invalid credentials" });

        const token = generateToken(admin._id);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        admin.otp = otp;
        admin.otpExpiry = Date.now() + 10 * 60 * 1000;
        await admin.save();

        await sendMail(
            email,
            "Admin Panel Password Reset",
            `<h1>Your OTP: ${otp}</h1><p>Valid for 10 minutes</p>`
        );

        res.json({ msg: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        console.log(email, otp, newPassword)
        const admin = await Admin.findOne({ email, otp });

        if (!admin || admin.otpExpiry < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        admin.password = await bcrypt.hash(newPassword, 12);
        admin.otp = undefined;
        admin.otpExpiry = undefined;
        await admin.save();

        res.json({ msg: "Password reset successful" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ err, msg: "Server error" });
    }
};
module.exports = { register, login, forgotPassword, resetPassword }