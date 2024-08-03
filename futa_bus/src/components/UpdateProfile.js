import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const response = await axiosInstance.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('API Response:', response);
        setFormData(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axiosInstance.put('/users/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('API Response:', response);
      if (response.data.success) {
        setMessage('Cập nhật thông tin thành công!');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error.response.data);
      setMessage('Cập nhật thông tin thất bại!');
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
          maxWidth: 500,
          margin: 'auto',
          marginTop: 8
        }}
      >
        <Typography variant="h4" gutterBottom>Cập nhật thông tin</Typography>
        <form onSubmit={handleUpdateProfile}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>Cập nhật</Button>
        </form>
        <Typography variant="body1" sx={{ marginTop: 2 }}>{message}</Typography>
      </Box>
    </Container>
  );
};

export default UpdateProfile;
