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
        enum: ["orders", "proccess_orders", "users", "products", "update_products", "delete_products", "add_products"]
    },
    role: {
        type: String,
        default: "subadmin"
    },
    status: {
        type: Boolean,
        default: true
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
