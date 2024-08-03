const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  departure_time: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  price: {type: Number, required: true},
});

module.exports = mongoose.model('Trip', tripSchema);