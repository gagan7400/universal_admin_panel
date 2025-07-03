const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const User = require("../models/usermodel");

exports.isAuthenticatedAdmin = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHander("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //we can access the user information from the req whenever the user logines;
    req.user = await Admin.findById(decodedData.id);
    next();
});
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
                req.user = user;
                next();
            } else {
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
                new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }
        next();
    };
};
