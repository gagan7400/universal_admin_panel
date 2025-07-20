const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "subadmin"],
    default: "subadmin",
  },
  permissions: {
    type: [String], // e.g., ['manageOrders', 'viewUsers']
    default: [],
  },
  status: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model("Admin", adminSchema);

