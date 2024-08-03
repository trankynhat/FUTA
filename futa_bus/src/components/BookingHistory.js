import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Typography, Container, Grid, Card, CardContent, Box, Button } from '@mui/material';

const BookingHistory = () => {
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState('');

  const fetchBookingHistory = async () => {
    try {
      const response = await axiosInstance.get('/tickets/history'); // Thay đổi endpoint nếu cần
      console.log(response)
      if (response.status == 200) {
        setTrips(response.data); // Giả sử dữ liệu trả về có dạng bookings
        setMessage('');
      } else {
        setTrips([]);
        setMessage(response.data.message || 'Không tìm thấy lịch sử đặt vé!');
      }
    } catch (error) {
      console.error('Error fetching booking history:', error);
      setMessage('Không tìm thấy lịch sử đặt vé!');
      setTrips([]);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          margin: 'auto',
          marginTop: 8
        }}
      >
        <Typography variant="h4" gutterBottom>Lịch sử đặt vé</Typography>
        <Button variant="contained" color="primary" onClick={fetchBookingHistory}>
          Xem Lịch Sử Đặt Vé
        </Button>
        {message && <Typography variant="body1" sx={{ marginTop: 2 }}>{message}</Typography>}
      </Box>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {trips.map((trip) => (
          <Grid item xs={12} sm={6} md={4} key={trip._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">Ticket Id: {trip._id}</Typography>
                <Typography variant="body1">Trip Id: {trip.trip._id}</Typography>
                <Typography variant="body1">Departure: {trip.trip.departure}</Typography>
                <Typography variant="body1">Destination: {trip.trip.destination}</Typography>
                <Typography variant="body1">Departure Time: {new Date(trip.trip.departure_time).toLocaleString()}</Typography>
                <Typography variant="body1">Seats Booked: {trip.seats}</Typography>
                <Typography variant="body1">Status: {trip.status}</Typography>
                <Typography variant="body1">Price: {trip.trip.price.toLocaleString()} VND</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookingHistory;
