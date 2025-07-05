const jwt = require("jsonwebtoken");
const Subadmin = require("../models/subadminModel");

const isSubadmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const subadmin = await Subadmin.findById(decoded.id);
        if (!subadmin) return res.status(401).json({ message: "Invalid subadmin" });

        req.subadmin = subadmin;
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
const checkSubadminPermission = (permission) => {
    return (req, res, next) => {
        if (req.subadmin?.permissions?.includes(permission)) {
            return next();
        }
        return res.status(403).json({ message: "Permission denied" });
    };
};

module.exports = { isSubadmin, checkSubadminPermission };
