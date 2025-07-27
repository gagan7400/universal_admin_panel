const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String },
    status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Pending' },
    paymentId: { type: String },
    paidAt: { type: Date },
});

module.exports = mongoose.model('Payments', paymentSchema);
