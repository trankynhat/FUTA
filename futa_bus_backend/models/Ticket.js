const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seats: { type: Number, required: true },
  status: { type: String, default: "booked" },
});

module.exports = mongoose.model("Ticket", ticketSchema);
