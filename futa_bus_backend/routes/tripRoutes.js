const express = require("express");
const {
  searchTrips,
  getDeparture,
  getDestination,
  getTripDetails,
} = require("../controllers/tripController");
const router = express.Router();

router.get("/search", searchTrips);
router.get("/getDeparture", getDeparture);
router.get("/getDestination", getDestination);
router.get("/:tripId", getTripDetails);

module.exports = router;
