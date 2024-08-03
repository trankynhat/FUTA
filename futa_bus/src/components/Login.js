import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext"; // Đảm bảo đường dẫn đúng

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      login(user); // Truyền thông tin người dùng tới context
      console.log("Login successful:", user); // Kiểm tra thông tin người dùng
      navigate("/search");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Đăng nhập thất bại!");
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
          maxWidth: 500,
          margin: "auto",
          marginTop: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Đăng nhập
        </Typography>
        <form onSubmit={handleLogin}>
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Đăng nhập
          </Button>
        </form>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
