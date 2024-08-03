import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';

const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTicketHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tickets/history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTickets(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTicketHistory();
  }, []);

  return (
    <Container>
      <Typography variant="h4">Lịch sử đặt vé</Typography>
      <List>
        {tickets.map(ticket => (
          <ListItem key={ticket._id}>
            <ListItemText primary={`Chuyến từ ${ticket.departure} đến ${ticket.destination} vào ${new Date(ticket.departure_time).toLocaleString()}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TicketHistory;