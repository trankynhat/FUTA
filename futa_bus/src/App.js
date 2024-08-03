import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import HomePage from './components/HomePage';
import SearchTrips from './components/SearchTrips';
import BookTicket from './components/BookTicket';
import Payment from './components/Payment';
import UpdateProfile from './components/UpdateProfile';
import TicketHistory from './components/TicketHistory';
import Register from './components/Register';
import Login from './components/Login';
import AuthProvider, { AuthContext } from './AuthContext';
import BookingHistory from './components/BookingHistory';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <div
        style={{
          backgroundImage: 'url("/background.jpg")', // Đường dẫn đến hình ảnh nền
          backgroundSize: 'cover', // Đảm bảo hình ảnh nền chiếm toàn bộ kích thước phần tử cha
          backgroundPosition: 'center', // Căn chỉnh hình ảnh nền vào giữa
          backgroundRepeat: 'no-repeat', // Ngăn lặp lại hình ảnh nền
          //filter: 'blur(5px)', // Áp dụng độ mờ
          minHeight: '100vh', // Chiều cao tối thiểu bằng chiều cao của màn hình
          position: 'relative', // Đặt vị trí tương đối để các phần tử con có thể chồng lên nền
        }}
      >
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<PrivateRoute><SearchTrips /></PrivateRoute>} />
            <Route path="/book" element={<PrivateRoute><BookTicket /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><TicketHistory /></PrivateRoute>} />
            <Route path="/booking-history" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
          </Routes>
        </Container>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;