import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axiosInstance from "../axiosInstance";
import TripDetails from "./TripDetails";

const BookTicket = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const { search } = useLocation(); // Lấy thông tin từ URL
  const tripId = new URLSearchParams(search).get("tripId"); // Lấy tripId từ query params
  const [formData, setFormData] = useState({
    seats: 1,
  });
  const [message, setMessage] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null); // State để lưu thông tin chuyến đi đã chọn
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        console.log(`Fetching details for tripId: ${tripId}`); // Log để kiểm tra tripId
        const response = await axiosInstance.get(`/trips/${tripId}`);
        console.log("Trip details response:", response.data); // Log để kiểm tra phản hồi API
        if (response.data.success) {
          setSelectedTrip(response.data.trip); // Lưu thông tin chuyến đi vào state selectedTrip
        } else {
          console.error("Error fetching trip details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBookTicket = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const response = await axiosInstance.post("/bookings", {
        ...formData,
        userId: user.id, // Bao gồm userId trong yêu cầu đặt vé
        tripId: tripId, // Bao gồm tripId trong yêu cầu đặt vé
      });
      console.log("API Response:", response);
      if (response.data.success) {
        setMessage("Đặt vé thành công!");
        const ticketId = response.data.ticket._id;
        navigate(`/payment?ticketId=${ticketId}`);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      setMessage("Đặt vé thất bại!");
    }
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
          Đặt vé
        </Typography>
        <form onSubmit={handleBookTicket}>
          <Typography variant="h6">
            Họ và tên: {user ? user.fullName : "Unknown"}
          </Typography>
          {selectedTrip ? (
            <>
              <TripDetails trip={selectedTrip} />{" "}
              {/* Hiển thị thông tin chi tiết của chuyến đi */}
            </>
          ) : (
            <Typography variant="body1">Loading trip details...</Typography>
          )}
          <TextField
            label="Seats"
            name="seats"
            type="number"
            value={formData.seats}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Đặt vé
          </Button>
        </form>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default BookTicket;
