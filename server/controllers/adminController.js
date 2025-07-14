let Admin = require("../models/admin.js");
let bcrypt = require("bcryptjs");
let nodemailer = require("nodemailer");
let jwt = require("jsonwebtoken");
let Joi = require("joi");
const common_functions = require("../utils/common_functions.js");
const generateToken = ({ adminId, role }) => {
    return jwt.sign({ id: adminId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
        if (existing) return res.status(400).json({ success: false, message: "Admin already exists" });

        const hashed = await bcrypt.hash(password, 12);
        const admin = await Admin.create({ email, password: hashed });

        res.status(200).json({ success: true, message: "Admin Registered Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: error.details[0].message,
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({
            code: 400,
            success: false,
            message: "User not found."
        });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(400).json({
            code: 400,
            success: false,
            message: "Password is incorrect."
        });

        const token = await generateToken({ adminId: admin._id, role: "admin" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json({
            code: 200,
            success: true,
            message: "Admin logged in successfully...",
            token,
            data: admin
        });
    } catch (err) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "An error occurred while processing your request.",
        });
    }
};

let logoutAdmin = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "Production"
    });
    res.json({ success: true, message: "Logged out" });
}
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        admin.otp = otp;
        admin.otpExpiry = Date.now() + 10 * 60 * 1000;
        await admin.save();

        await common_functions.sendEmail(
            email,
            "Admin Panel Password Reset",
            `<h1>Your OTP: ${otp}</h1><p>Valid for 10 minutes</p>`
        );

        res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (err) {

        res.status(500).json({ success: false, message: err.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const admin = await Admin.findOne({ email, otp });

        if (!admin || admin.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        admin.password = await bcrypt.hash(newPassword, 12);
        admin.otp = undefined;
        admin.otpExpiry = undefined;
        await admin.save();
        res.json({ success: true, message: "Password reset successful" });
    } catch (err) {

        res.status(500).json({ success: false, message: err.message });
    }
};

let getprofile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user._id).select("-password"); // exclude password
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
module.exports = { getprofile, register, login, forgotPassword, resetPassword, logoutAdmin }