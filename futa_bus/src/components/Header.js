import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          FUTA Bus
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/search">Tìm chuyến</Button>
        <Button color="inherit" component={Link} to="/book">Đặt vé</Button>
        <Button color="inherit" component={Link} to="/payment">Thanh toán</Button>
        <Button color="inherit" component={Link} to="/booking-history">Lịch sử đặt vé</Button> {/* Thêm nút Lịch sử đặt vé */}
        <Button color="inherit" component={Link} to="/update-profile">Profile</Button>
        <Button color="inherit" component={Link} to="/register">Đăng ký</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;