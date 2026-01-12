const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const User = require("../models/usermodel");

exports.isAuthenticatedAdmin = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
 
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user;
        user = await Admin.findById(decoded.id).select("-password");
        if (!user) {
            return next(new ErrorHandler("Unauthorized ", 401));
        }
        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorHandler(err.message, 401));
    }
});
exports.checkPermission = (permissionKey) => {
    return (req, res, next) => {
        if (req.user.role === 'admin') return next(); // full access

        if (req.user.role === 'subadmin' && req.user.permissions.includes(permissionKey)) {
            return next(); // permission granted
        }

        return res.status(403).json({ message: "Permission Denied" });
    };
};
exports.isAuthenticatedUser = async (req, res, next) => {
 
    let bearerHeader = req.header("authorization");

    if (bearerHeader !== undefined) {
        let token = bearerHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    code: 401,
                    status: false,
                    message: "Invalid Token",
                    err: err,
                });
            }

            if (decoded) {
                let user = await User.findById(decoded.id);

                if (!user) {
                    console.log("e")
                    return next(new ErrorHandler("User Not Found", 401));
                }
                req.user = user;
                next();
            } else {
                console.log("invl")
                return res.status(401).json({
                    code: 401,
                    status: false,
                    message: "Invalid Token",
                });
            }
        });
    } else {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "Token is required",
        });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }
        next();
    };
};
