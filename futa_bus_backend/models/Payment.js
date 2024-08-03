const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  amount: { type: Number, required: true},
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'completed' }, // completed, failed
  bankCode: { type: String, required: true},
});

module.exports = mongoose.model('Payment', paymentSchema);