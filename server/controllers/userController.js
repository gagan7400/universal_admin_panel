const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/usermodel.js");
const common_functions = require("../utils/common_functions.js"); // adjust path if needed
const UserSession = require("../models/userSessionmodel.js"); // Session model
const { generateToken } = require("../utils/token.js"); // Your custom token function

const registration = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().optional(),
            password: Joi.string().required(),
            applicationId: Joi.string().required(),
            deviceType: Joi.string().required(),
        });
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
        common_functions.sendEmail(req.body.email, subject, content);

        // 7. Success response
        return res.status(200).json({ code: 200, status: true, message: "User registered successfully." });

    } catch (error) {
        console.error("Error while user registration:", error);
        return res.status(400).json({ code: 400, status: false, message: "An error occurred while processing your request." });
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

        if (!user.isVerified) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "User is not verified. Please verify your email/OTP.",
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

const verifyOTP = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            otp: Joi.string().length(4).pattern(/^[0-9]+$/).required(),
            verificationType: Joi.string().valid("EMAIL", "FORGOTPASSWORD").insensitive().required(),
            applicationId: Joi.string().required(),
            deviceType: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ code: 400, status: false, message: error.details[0].message });
        }

        const { email, otp, verificationType, applicationId, deviceType } = req.body;

        let query = { email: email.toLowerCase() };
        let otpField = "";
        let otpDateTimeField = "";

        if (verificationType.toUpperCase() === "EMAIL") {
            query.otp = otp;
            otpField = "otp";
            otpDateTimeField = "otpDateTime";
        } else {
            query.forgotPasswordOtp = otp;
            otpField = "forgotPasswordOtp";
            otpDateTimeField = "forgotPasswordOtpDateTime";
        }

        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ code: 400, status: false, message: "Invalid OTP" });
        }

        const currentTime = new Date();
        const otpCreatedTime = new Date(user[otpDateTimeField]);
        const expiryTime = new Date(otpCreatedTime.getTime() + 5 * 60000); // 5 minutes

        if (currentTime > expiryTime) {
            return res.status(400).json({ code: 400, status: false, message: "OTP has been expired." });
        }

        // Update user based on type
        if (verificationType.toUpperCase() === "EMAIL") {
            user.otp = "";
            user.isVerified = true;
            user.isActive = true;
        } else {
            user.forgotPasswordOtp = "";
            user.forgotPasswordOtpVerified = true;
        }

        await user.save();

        // Generate tokens
        const { token, refreshToken } = generateToken(user._id, user.email, applicationId);

        // Create a session
        const newSession = new UserSession({
            userId: user._id,
            applicationId,
            deviceType,
            token,
        });
        await newSession.save();

        return res.status(200).json({
            code: 200,
            status: true,
            message: "OTP verified successfully.",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                token,
                refreshToken,
            },
        });
    } catch (err) {
        console.error("Error while verifying OTP:", err);
        return res.status(400).json({
            code: 400,
            status: false,
            message: "An error occurred",
            error: err.message,
        });
    }
};

const resendOTP = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            applicationId: Joi.string().required(),
            deviceType: Joi.string().required(),
            verificationType: Joi.string().valid("EMAIL", "FORGOTPASSWORD").insensitive().required(),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ code: 400, status: false, message: error.details[0].message });
        }

        const { email, verificationType } = value;
        const emailLower = email.toLowerCase();
        const emailOTP = Math.floor(1000 + Math.random() * 9000);

        const emailOTPDateTime = new Date();

        // Set the OTP field based on verificationType
        let updateFields = {};
        if (verificationType.toUpperCase() === "EMAIL") {
            updateFields.otp = emailOTP;
            updateFields.otpDateTime = emailOTPDateTime;
        } else if (verificationType.toUpperCase() === "FORGOTPASSWORD") {
            updateFields.forgotPasswordOtp = emailOTP;
            updateFields.forgotPasswordOtpDateTime = emailOTPDateTime;
        }

        // Find user
        const user = await User.findOne({ email: emailLower });
        if (!user) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "User not found.",
            });
        }

        // Update user with OTP
        const updated = await User.updateOne({ email: emailLower }, { $set: updateFields });

        if (updated.modifiedCount > 0) {
            const subject = "Verify your email";
            const content = `<h1>${emailOTP}</h1>`;

            // Send the email
            await common_functions.sendEmail(email, subject, content);

            return res.status(200).json({
                code: 200,
                status: true,
                message: "OTP has been sent successfully.",
            });
        } else {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Error while sending OTP.",
            });
        }
    } catch (err) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "An error occurred",
            error: err.message,
        });
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
        return res.status(400).json({ code: 400, status: false, message: "An error occurred", error: err.message });
    }
};

const setNewPassword = async (req, res) => {
    try {
        // Validate input
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: error.details[0].message,
            });
        }

        const email = req.body.email.toLowerCase();

        // Find active user
        const user = await User.findOne({ email, isActive: true });

        if (!user) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Email is incorrect.",
            });
        }

        // Check if the new password is same as the current one
        const isPasswordMatching = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatching) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Old password and new password should not be same.",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            code: 200,
            status: true,
            message: "Your password has been updated successfully.",
        });
    } catch (err) {
        console.error("Error while resetting password:", err);
        return res.status(400).json({
            code: 400,
            status: false,
            message: "An error occurred.",
            error: err.message,
        });
    }
};

const deleteUserAccount = async (req, res) => {
    try {
        // Validate request params
        const schema = Joi.object().keys({
            id: Joi.string().required(),
        });

        const { error, value } = schema.validate(req.params);

        if (error) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: error.details[0].message,
            });
        }

        const userId = value.id;

        // Check if active user exists
        const user = await User.findOne({ _id: userId, isActive: true });

        if (!user) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "User account already deleted.",
            });
        }

        // Soft delete user by setting isActive to false
        // await User.updateOne({ _id: userId, isActive: true }, { $set: { isActive: false } });

        // Permanently delete the user 
        await User.findByIdAndDelete(userId)

        return res.status(200).json({
            code: 200,
            status: true,
            message: "User account has been deleted successfully.",
        });
    } catch (err) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "An error occurred",
            error: err.message,
        });
    }
};


module.exports = { registration, verifyOTP, resendOTP, forgotPassword, login, setNewPassword, deleteUserAccount };