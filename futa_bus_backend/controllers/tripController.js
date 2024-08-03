const Trip = require("../models/Trip");
const moment = require("moment");

const searchTrips = async (req, res) => {
  const { departure, destination, departure_time } = req.query;

  try {
    const date = moment.utc(departure_time, "DD-MM-YYYY").toDate();
    const trips = await Trip.find({
      departure,
      destination,
      $expr: {
        $and: [
          {
            $eq: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$departure_time" },
              },
              { $dateToString: { format: "%Y-%m-%d", date: date } },
            ],
          },
          {
            $gt: ["$availableSeats", 0],
          },
        ],
      },
    });

    if (trips.length === 0) {
      return res.json({ success: false, message: "Không tìm thấy chuyến!" });
    }

    res.json({ success: true, trips });
  } catch (error) {
    console.error("Error searching trips:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getDeparture = async (req, res) => {
  try {
    const departures = await Trip.distinct("departure");
    res.json(departures);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unique departures" });
  }
};

const getDestination = async (req, res) => {
  try {
    const destinations = await Trip.distinct("destination");
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unique departures" });
  }
};

const getTripDetails = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    res.json({ success: true, trip });
  } catch (error) {
    console.error("Error fetching trip details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { searchTrips, getDeparture, getDestination, getTripDetails };
