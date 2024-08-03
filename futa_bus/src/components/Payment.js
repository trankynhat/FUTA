import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../axiosInstance';
import { TextField, Button, Typography, Container, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { AuthContext } from "../AuthContext";
import { useLocation } from "react-router-dom";

const Payment = () => {
    const { user } = useContext(AuthContext);
    const { search } = useLocation();
    const ticketId = new URLSearchParams(search).get('ticketId');

    const [formData, setFormData] = useState({
        paymentMethod: '',
        bankCode: '',
    });
    const [message, setMessage] = useState('');
    const [ticket, setTicket] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                console.log(`Fetching details for ticketId: ${ticketId}`);
                const response = await axiosInstance.get(`/tickets/${ticketId}`);
                console.log('API Response:', response);

                //if (response.status === 200 && response.data && response.data.ticket) {
                if (response.data.success) {
                    setTicket(response.data.ticket);
                    setMessage('');
                } else {
                    setTicket(null);
                    setMessage('Khởi tạo thanh toán thất bại!');
                }
            } catch (error) {
                console.error('Error in fetchTicketDetails:', error);
                setTicket(null);
                setMessage('Khởi tạo thanh toán thất bại!');
            }
        };

        if (ticketId) {
            fetchTicketDetails();
        }
    }, [ticketId]);
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        /*if (!ticket) {
            setMessage('Thông tin vé không hợp lệ!');
            return;
        }*/

        //const amount = ticket.seats * ticket.trip.price;

        try {
            const response0 = await axiosInstance.post('/payments', {
                ticketId,
                amount: 250000,
                ...formData,
            });
            setAmount(response0.data.amount);
            const response = await axiosInstance.post('/payments/create_payment_url', {
                amount: 250000,
                orderId: ticketId,
                orderInfo: `Payment for ticket ${ticketId}`,
                bankCode: formData.bankCode
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('API Response:', response);
            if (response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                setMessage('Khởi tạo thanh toán thất bại!');
            }
        } catch (error) {
            console.error('Error in handlePayment:', error.response || error.message || error);
            setMessage('Khởi tạo thanh toán thất bại!');
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
                <Typography variant="h4" gutterBottom>Thanh toán</Typography>
                <form onSubmit={handlePayment}>
                    <Typography variant="h6"> Họ và tên: {user ? user.fullName : "Unknown"} </Typography>
                    <Typography variant="h6"> Mã vé: {ticketId} </Typography>
                    {/*<Typography variant="h6"> Tổng tiền: {ticket ? ticket.seats * ticket.trip.price : 0} </Typography>*/}
                    <Typography variant="h6"> Tổng tiền: 250000 </Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="paymentMethod-label">Payment Method</InputLabel>
                        <Select
                            labelId="paymentMethod-label"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            required
                        >
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="bankCode-label">Ngân hàng</InputLabel>
                        <Select
                            labelId="bankCode-label"
                            name="bankCode"
                            value={formData.bankCode}
                            onChange={handleInputChange}
                            required
                        >
                            <MenuItem value="NCB">NCB</MenuItem>
                            <MenuItem value="ACB">ACB</MenuItem>
                            <MenuItem value="AGRIBANK">Agribank</MenuItem>
                            <MenuItem value="BIDV">BIDV</MenuItem>
                            <MenuItem value="VCB">Vietcombank</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" fullWidth>Thanh toán</Button>
                </form>
                <Typography variant="body1" sx={{ marginTop: 2 }}>{message}</Typography>
            </Box>
        </Container>
    );
};

export default Payment;