// models/userSessionmodel.js
const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }, // Index for fast user queries
    applicationId: String,
    deviceType: String,
    token: { type: String, index: true }, // Index for quick session checking
    createdAt: { type: Date, default: Date.now, expires: '30d' }, // TTL Index: Auto delete sessions after 30 days
});

module.exports = mongoose.model("UserSession", userSessionSchema);
