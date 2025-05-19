const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicationId: String,
    deviceType: String,
    token: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserSession", userSessionSchema);
