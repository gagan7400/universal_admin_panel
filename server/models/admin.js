let mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  role: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admin", adminSchema);
