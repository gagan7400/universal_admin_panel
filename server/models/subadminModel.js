const mongoose = require("mongoose");

const subadminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    permissions: {
        type: [String], // e.g., ["view_orders", "process_orders"]
        default: [],
    },
    role: {
        type: String,
        default: "subadmin"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Subadmin", subadminSchema);
