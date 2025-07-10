const Subadmin = require("../models/subadminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createSubadmin = async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;

        const existing = await Subadmin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Subadmin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSubadmin = await Subadmin.create({
            name,
            email,
            password: hashedPassword,
            permissions,
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, subadmin: newSubadmin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginSubadmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const subadmin = await Subadmin.findOne({ email });

        if (!subadmin) {
            return res.status(404).json({ message: "Subadmin not found" });
        }

        const isMatch = await bcrypt.compare(password, subadmin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: subadmin._id, role: "subadmin" }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({
            success: true,
            token,
            subadmin: {
                id: subadmin._id,
                name: subadmin.name,
                permissions: subadmin.permissions,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const deleteSubadmin = async (req, res) => {
    try {
        const subadmin = await Subadmin.findById(req.params.id);
        if (!subadmin) {
            return res.status(404).json({ message: "Subadmin not found" });
        }

        await Subadmin.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Subadmin deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const updateSubadmin = async (req, res) => {
    try {
        const subadmin = await Subadmin.findById(req.params.id);
        if (!subadmin) {
            return res.status(404).json({ message: "Subadmin not found" });
        }
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            req.body.password = hashedPassword;
        }
        await Subadmin.findByIdAndUpdate(subadmin._id, req.body)
        res.status(200).json({ success: true, message: "Subadmin Updated Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = { createSubadmin, deleteSubadmin, loginSubadmin, updateSubadmin }