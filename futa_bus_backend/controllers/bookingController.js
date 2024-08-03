const Ticket = require("../models/Ticket");
const Trip = require("../models/Trip");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  const { userId, tripId, seats } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ticket = new Ticket({
      user: userId,
      trip: tripId,
      seats,
      status: "booked",
    });

    await ticket.save();

    trip.availableSeats -= seats;
    await trip.save();

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user").populate("trip");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};