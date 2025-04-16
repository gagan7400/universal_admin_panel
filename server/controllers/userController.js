const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const common_functions = require("../utils/common_functions.js"); // adjust path if needed


const UserSession = require("../models/UserSession.js"); // Session model
const { generateToken } = require("../utils/token.js"); // Your custom token function




const registration = async (req, res) => {
    console.log("called")
    try {
        // 1. Validation schema
        const schema = Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().optional(),
            password: Joi.string().required(),
            applicationId: Joi.string().required(),
            deviceType: Joi.string().required(),
        });
        console.log(req.body)
        // 2. Validate incoming data
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ code: 400, status: false, message: error.details[0].message });

        // 3. Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email, isActive: true });
        if (existingUser) {
            return res.status(400).json({ code: 400, status: true, message: "User already registered with given email." });
        }

        // 4. Hash password & generate OTP
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const emailOTP = Math.floor(1000 + Math.random() * 9000);

        // 5. Create and save user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashPassword,
            applicationId: req.body.applicationId,
            deviceType: req.body.deviceType,
            otp: emailOTP,
        });

        await newUser.save();

        // 6. Send Email
        const subject = "Verify your email";
        const content = `<h1>${emailOTP}</h1>`;
        console.log("email sent")
        common_functions.sendEmail(req.body.email, subject, content);

        // 7. Success response
        return res.status(200).json({ code: 200, status: true, message: "User registered successfully." });

    } catch (error) {
        console.error("Error while user registration:", error);
        return res.status(400).json({ code: 400, status: false, message: "An error occurred while processing your request." });
    }
};



const verifyOTP = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.number().required(),
        });

        const { error } = schema.validate(req.body);

        if (error) return res.status(400).json({ code: 400, status: false, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email, isActive: true });

        if (!user) return res.status(400).json({ code: 400, status: false, message: "User not found." });
        if (Number(user.otp) !== Number(req.body.otp)) {
            return res.status(400).json({ code: 400, status: false, message: "Incorrect OTP." });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({ code: 200, status: true, message: "OTP verified successfully." });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(400).json({ code: 400, status: false, message: "An error occurred while verifying OTP." });
    }
};

const resendOTP = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const { error } = schema.validate(req.body);
        console.log(error)
        if (error) return res.status(400).json({ code: 400, status: false, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email, isActive: true });

        if (!user) return res.status(400).json({ code: 400, status: false, message: "User not found." });

        const emailOTP = Math.floor(1000 + Math.random() * 9000);
        user.otp = emailOTP;
        await user.save();

        const subject = "Verify your email";
        const content = `<h1>${emailOTP}</h1>`;
        common_functions.sendEmail(user.email, subject, content);

        return res.status(200).json({ code: 200, status: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error resending OTP:", error);
        return res.status(400).json({ code: 400, status: false, message: "An error occurred while resending OTP." });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ code: 400, status: false, message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email, isActive: true });
        if (!user) return res.status(400).json({ code: 400, status: false, message: "Email is incorrect" });

        const OTP = Math.floor(1000 + Math.random() * 9000);
        const date = new Date();
        const currentDate = date.toISOString().replace('T', ' ').slice(0, 19); // "YYYY-MM-DD HH:mm:ss"

        user.forgotPasswordOtp = OTP;
        user.forgotPasswordOtpDateTime = currentDate;
        await user.save();

        const subject = "Verify OTP";
        const content = `
      <h4>Hello ${user.firstName} ${user.lastName},</h4>
      <p>We have received your request to verify your email with the email address ${user.email}.
      The authorization code you requested for verifying your email address is listed below.</p>
      <p style="text-align: center; font-size: 24px;"><b>${OTP}</b></p>
      <p>Please note that this authorization code will expire in 5 minutes and is used to securely enable you to link your AR Games account.</p>
      <p>Regards,<br>AR Games Team</p>
    `;

        common_functions.sendEmail(user.email, subject, content);

        return res.status(200).json({ code: 200, status: true, message: "An OTP has been sent to your email address." });
    } catch (err) {
        console.log("Error while forgot password:", err);
        return res.status(400).json({ code: 400, status: false, message: "An error occurred", error: err.message });
    }
};


const login = async (req, res) => {
    try {
        // Validate Input
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            applicationId: Joi.string().required(),
            deviceType: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: error.details[0].message,
            });
        }

        // Check if user exists
        const user = await User.findOne({
            email: req.body.email.toLowerCase(),
            isActive: true,
        });

        if (!user) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "User not found.",
            });
        }

        // Verify password
        const isPasswordMatching = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatching) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Password is incorrect.",
            });
        }

        // Generate token
        const { token, refreshToken } = generateToken(user._id, user.email, req.body.applicationId);

        // Create session
        const newSession = new UserSession({
            userId: user._id,
            applicationId: req.body.applicationId,
            deviceType: req.body.deviceType,
            token,
        });

        await newSession.save();

        // Send response
        return res.status(200).json({
            code: 200,
            status: true,
            message: "User logged in successfully.",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                token,
                refreshToken,
            },
        });
    } catch (error) {
        console.error("Error while login:", error);
        return res.status(400).json({
            code: 400,
            status: false,
            message: "An error occurred while processing your request.",
        });
    }
};



module.exports = { registration, verifyOTP, resendOTP, forgotPassword, login };