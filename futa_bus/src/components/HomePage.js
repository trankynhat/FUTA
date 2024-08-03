// src/components/HomePage.js

import React from 'react';
import { Typography, Button, Grid } from '@mui/material';

const HomePage = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
     
    >
      <Grid item xs={12} style={{ zIndex: 1 }}> {/* Phần tử con */}
        <Typography variant="h3" align="center" gutterBottom style={{ color: '#ffffff' }}>
          Welcome to Futa Bus Booking System
        </Typography>
        <Typography variant="body1" align="center" paragraph style={{ color: '#ffffff' }}>
          Discover convenient and reliable bus booking services with Futa Bus. Start your journey today!
        </Typography>
        <Grid container justifyContent="center">
          <Button variant="contained" color="primary" href="/search">
            Find Trips
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
