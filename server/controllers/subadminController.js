const Subadmin = require("../models/subadminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createSubadmin = async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;

        const existing = await Subadmin.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "Subadmin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSubadmin = await Subadmin.create({
            name,
            email,
            password: hashedPassword,
            permissions,
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, subadmin: newSubadmin, message: "SubAdmin Created Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const getAllSubadmins = async (req, res) => {
    try {
        let subadmins = await Subadmin.find();
        res.status(200).json({ success: true, message: "SubAdmins Get Successfully", data: subadmins })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const loginSubadmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const subadmin = await Subadmin.findOne({ email });

        if (!subadmin) {
            return res.status(404).json({ message: "Subadmin not found" });
        }
        if (subadmin && !subadmin.status) {
            return res.status(404).json({ message: "Subadmin is found But not Active" });
        }

        const isMatch = await bcrypt.compare(password, subadmin.password);
        console.log(isMatch, subadmin, email, password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: subadmin._id, role: "subadmin" }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json({
            code: 200,
            success: true,
            message: "Subadmin logged in successfully...",
            token,
            data: subadmin
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const deleteSubadmin = async (req, res) => {
    try {
        const subadmin = await Subadmin.findById(req.params.id);
        if (!subadmin) {
            return res.status(404).json({ success: false, message: "Subadmin not found" });
        }

        await Subadmin.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Subadmin deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const updateSubadmin = async (req, res) => {
    try {
        const subadmin = await Subadmin.findById(req.params.id);
        if (!subadmin) {
            return res.status(404).json({ success: false, message: "Subadmin not found" });
        }
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        } else {
            req.body.password = subadmin.password
        }
        await Subadmin.findByIdAndUpdate(subadmin._id, req.body)
        res.status(200).json({ success: true, message: "Subadmin Updated Successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }
};
let getsubadminprofile = async (req, res) => {
    try {
        const admin = await Subadmin.findById(req.user._id).select("-password"); // exclude password
        if (!admin) {
            return res.status(404).json({ success: false, message: "SubAdmin not found" });
        }
        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
module.exports = { createSubadmin, getAllSubadmins, deleteSubadmin, loginSubadmin, updateSubadmin, getsubadminprofile }