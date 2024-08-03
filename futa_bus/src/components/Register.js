import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Đăng ký thành công!');
    } catch (error) {
      console.error(error.response.data);
      setMessage('Đăng ký thất bại!');
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
        <Typography variant="h4" gutterBottom>Đăng ký</Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
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
          <Button type="submit" variant="contained" color="primary" fullWidth>Đăng ký</Button>
        </form>
        <Typography variant="body1" sx={{ marginTop: 2 }}>{message}</Typography>
      </Box>
    </Container>
  );
};

export default Register;
