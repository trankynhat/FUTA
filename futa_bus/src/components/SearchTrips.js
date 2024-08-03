import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const SearchTrips = () => {
  const [formData, setFormData] = useState({
    departure: "",
    destination: "",
    departure_time: null,
  });
  const [departure, setDeparture] = useState([]);
  const [destination, setDestination] = useState([]);
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeparture = async () => {
      try {
        const response = await axiosInstance.get("/trips/getDeparture");
        setDeparture(response.data);
      } catch (error) {
        console.error("Error fetching departure:", error);
      }
    };

    fetchDeparture();
  }, []);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axiosInstance.get("/trips/getDestination");
        setDestination(response.data);
      } catch (error) {
        console.error("Error fetching destination:", error);
      }
    };

    fetchDestination();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      departure_time: date ? format(date, "dd-MM-yyyy") : "",
    });
  };

  const handleSearchTrips = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get("/trips/search", {
        params: {
          ...formData,
        },
      });
      if (response.data.success) {
        setTrips(response.data.trips);
        setMessage("");
      } else {
        setMessage(response.data.message);
        setTrips([]);
      }
    } catch (error) {
      console.error("Error searching trips:", error);
      setMessage("Không tìm thấy chuyến!");
      setTrips([]);
    }
  };

  const formatDate = (departureTime) => {
    if (!departureTime) return ""; // Handle case where departureTime is not defined

    const dateObj = new Date(departureTime);

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toISOString().split("T")[0];
  };

  const handleCardClick = (tripId) => {
    navigate(`/book?tripId=${tripId}`);
  };

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          margin: "auto",
          marginTop: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Tìm chuyến
        </Typography>
        <form onSubmit={handleSearchTrips}>
          <TextField
            select
            label="Departure"
            name="departure"
            value={formData.departure}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          >
            {departure.map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          >
            {destination.map((dest) => (
              <MenuItem key={dest} value={dest}>
                {dest}
              </MenuItem>
            ))}
          </TextField>

          <Typography sx={{ marginTop: 2 }}></Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              format="dd-MM-yyyy"
              value={
                formData.departure_time
                  ? new Date(formData.departure_time)
                  : null
              }
              onChange={handleDateChange}
            />
          </LocalizationProvider>
          <Typography sx={{ marginTop: 2 }}></Typography>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            TÌM KIẾM
          </Button>
        </form>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {trips.map((trip) => (
          <Grid item xs={12} sm={6} md={4} key={trip._id}>
            <Card>
              <CardContent>
                <Typography variant="body1">
                  {trip.departure} - {trip.destination}
                </Typography>
                <Typography variant="body1">
                  Departure Time: {formatDate(trip.departure_time)}
                </Typography>
                <Typography variant="body1">
                  Available Seats: {trip.availableSeats}
                </Typography>
                <Typography variant="body1">Price: {trip.price}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCardClick(trip._id)}
                >
                  Chọn chuyến
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchTrips;
