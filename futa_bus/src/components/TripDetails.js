// src/components/TripDetails.js

import { Grid, Typography } from "@mui/material";
import React from "react";

const TripDetails = ({ trip }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Thông tin chuyến đi đã chọn:</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          <strong>Thời gian:</strong> {trip.time}
        </Typography>
        <Typography variant="body1">
          <strong>Điểm đi:</strong> {trip.departure}
        </Typography>
        <Typography variant="body1">
          <strong>Điểm đến:</strong> {trip.destination}
        </Typography>
        <Typography variant="body1">
          <strong>Giá vé:</strong> {trip.price}
        </Typography>
        <Typography variant="body1">
          <strong>Số lượng vé:</strong> {trip.seats}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TripDetails;
