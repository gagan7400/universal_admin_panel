const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const User = require("../models/usermodel.js");
const common_functions = require("../utils/common_functions.js"); // adjust path if needed
const UserSession = require("../models/userSessionmodel.js"); // Session model
const { generateToken } = require("../utils/token.js"); // Your custom token function
const base_url = process.env.NODE_ENV == "production" ? process.env.BASE_URL_LIVE : process.env.BASE_URL;
 

const registration = async (req, res) => {

    try {
        const addressSchema = Joi.object({
            fullName: Joi.string().required(),
            mobileNumber: Joi.number().required(),
            addressLine: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            postalCode: Joi.string().required(),
            country: Joi.string().optional(),
            isDefault: Joi.boolean().optional()
        });

        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().optional(),
            address: Joi.array().items(addressSchema).optional(),
            password: Joi.string().required(),
            applicationId: Joi.string().required(),
            deviceType: Joi.string().required(),
        });

        const file = req.file;
        const image = file
            ? { filename: file.filename, url: `${base_url}/uploads/${file.filename}` }
            : { filename: "", url: "" };

        // Validate incoming data
        if (typeof req.body.address === 'string') {
            try {
                req.body.address = JSON.parse(req.body.address);
            } catch (e) {
                return res.status(400).json({ code: 400, status: false, message: "Invalid address format" });
            }
        }
        const { error, value } = schema.validate(req.body, { allowUnknown: true });
        if (error)
            return res.status(400).json({
                code: 400,
                status: false,
                message: error.details[0].message,
            });

        // Check if user already exists
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: !existingUser.isActive
                    ? "User already registered but not verified!"
                    : "User already registered with given email.",
            });
        }

        // Hash password & generate OTP
        const hashPassword = bcrypt.hashSync(value.password, 10);
        const emailOTP = Math.floor(1000 + Math.random() * 9000);

        // Ensure one default address
        let addresses = [];
        if (Array.isArray(value.address)) {
            addresses = value.address.map((addr, index) => ({
                ...addr,
                isDefault: index === 0 ? true : addr.isDefault || false,
            }));
        }

        // Create and save user
        const newUser = new User({
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            phone: value.phone,
            password: hashPassword,
            applicationId: value.applicationId,
            deviceType: value.deviceType,
            otp: emailOTP,
            image,
            address: addresses,
        });

        await newUser.save();

        // Send Email
        const subject = "Verify your email";
        const content = `<h1>${emailOTP}</h1>`;
        common_functions.sendEmail(value.email, subject, content);

        // Success response
        return res.status(200).json({
            code: 200,
            status: true,
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(400).json({
            code: 400,
            status: false,
            message: "An error occurred while processing your request.",
        });
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

        if (!user.isVerified || !user.isActive) {
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
            id: user._id,
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
                image: user.image,
                address: user.address,
                token,
                refreshToken,
            },
        });
    } catch (error) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: error.message,
        });
    }
};
const verifyAccount = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ code: 400, status: true, message: "User Not Found." });
        }
        const emailOTP = Math.floor(1000 + Math.random() * 9000);
        user.otp = emailOTP;
        user.save();
        // 6. Send Email
        const subject = "Verify your email";
        const content = `<h1>${emailOTP}</h1>`;
        await common_functions.sendEmail(email, subject, content);
        res.send({ status: true, message: "Otp Sent on your Email Id" })

    } catch (error) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: error.message,
        });
    }
}
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
            id: user._id,
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

        const id = value.id;

        // Check if active user exists
        const user = await User.findOne({ _id: id, isActive: true });

        if (!user) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "User account already deleted.",
            });
        }

        // Soft delete user by setting isActive to false
        await User.findByIdAndUpdate(id, { isActive: false })
        // await User.findByIdAndDelete(id)
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

const getAllUsers = async (req, res) => {
    try {
        let users = await User.find();
        res.status(200).send({ status: true, message: "Users Get Successfully", data: users })
    } catch (error) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: error.message,
            error: error.message,
        });
    }
}
const countUsers = async (req, res) => {
    try {
        let users = await User.countDocuments();
        res.status(200).send({ status: true, message: "Users Get Successfully", data: users })
    } catch (error) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: error.message,
            error: error.message,
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const schema = Joi.object({
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            phone: Joi.string().optional(),
            applicationId: Joi.string().optional(),
            deviceType: Joi.string().optional(),
            address: Joi.array().items(
                Joi.object({
                    _id: Joi.string().optional(),
                    fullName: Joi.string().required(),
                    mobileNumber: Joi.string().required(),
                    addressLine: Joi.string().required(),
                    city: Joi.string().required(),
                    state: Joi.string().required(),
                    postalCode: Joi.string().required(),
                    country: Joi.string().optional(),
                    isDefault: Joi.boolean().optional()
                })
            ).optional()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ code: 400, status: false, message: error.details[0].message });

        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ code: 404, status: false, message: "User not found" });

        let updatedData = {
            firstName: req.body.firstName || user.firstName,
            lastName: req.body.lastName || user.lastName,
            phone: req.body.phone || user.phone,
            applicationId: req.body.applicationId || user.applicationId,
            deviceType: req.body.deviceType || user.deviceType
        };

        // Handle image
        if (req.file) {
            if (user.image?.filename) {
                const oldImagePath = path.join(__dirname, "../uploads", user.image.filename);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updatedData.image = {
                filename: req.file.filename,
                url: `${base_url}/uploads/${file.filename}`
            };
        }

        // Handle address update
        if (req.body.address) {
            const incomingAddresses = req.body.address;
            const updatedAddresses = [];

            for (let addr of incomingAddresses) {
                if (addr._id) {
                    // Update existing address
                    const index = user.address.findIndex(a => a._id.toString() === addr._id);
                    if (index !== -1) {
                        user.address[index] = { ...user.address[index]._doc, ...addr };
                    } else {
                        updatedAddresses.push(addr); // Not found, treat as new
                    }
                } else {
                    updatedAddresses.push(addr); // New address
                }
            }

            // Merge updated new addresses
            updatedData.address = [...user.address, ...updatedAddresses];
        }

        await User.findByIdAndUpdate(id, updatedData, { new: true });

        return res.status(200).json({ code: 200, status: true, message: "User updated successfully." });

    } catch (err) {
        console.error("Error while updating user:", err);
        return res.status(500).json({ code: 500, status: false, message: "Something went wrong" });
    }
};

const addressSchema = Joi.object({
    fullName: Joi.string().required(),
    mobileNumber: Joi.number().required(),
    addressLine: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().optional(),
    isDefault: Joi.boolean().optional(),
});
const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: false, message: "User not found" });
        return res.status(200).json({ status: true, message: "Addresses fetched", data: user.address });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

const addAddress = async (req, res) => {
    try {
        const { error } = addressSchema.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.details[0].message });

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: false, message: "User not found" });

        if (user.address.length === 0) {
            req.body.isDefault = true;
        } else if (req.body.isDefault) {
            user.address.forEach(addr => addr.isDefault = false);
        }

        user.address.push(req.body);
        await user.save();

        return res.status(200).json({ status: true, message: "Address added", data: user.address });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { error } = addressSchema.validate(req.body);
        if (error) return res.status(400).json({ status: false, message: error.details[0].message });

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: false, message: "User not found" });

        const address = user.address.id(req.params.addressId);
        if (!address) return res.status(404).json({ status: false, message: "Address not found" });

        if (req.body.isDefault) {
            user.address.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();

        return res.status(200).json({ status: true, message: "Address updated", data: address });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: false, message: "User not found" });

        const addressIndex = user.address.findIndex(addr => addr._id.toString() === req.params.addressId);
        if (addressIndex === -1) return res.status(404).json({ status: false, message: "Address not found" });

        const wasDefault = user.address[addressIndex].isDefault;
        user.address.splice(addressIndex, 1);
        await user.save();

        if (wasDefault && user.address.length > 0) {
            user.address[0].isDefault = true;
            await user.save();
        }

        return res.status(200).json({ status: true, message: "Address deleted" });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

const setDefaultAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: false, message: "User not found" });

        user.address.forEach(addr => addr.isDefault = false);
        const defaultAddress = user.address.id(req.params.addressId);
        if (!defaultAddress) return res.status(404).json({ status: false, message: "Address not found" });

        defaultAddress.isDefault = true;
        await user.save();

        return res.status(200).json({ status: true, message: "Default address set", data: defaultAddress });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress, registration, verifyOTP, verifyAccount, resendOTP, forgotPassword, login, setNewPassword, deleteUserAccount, getAllUsers, updateUser, countUsers
};