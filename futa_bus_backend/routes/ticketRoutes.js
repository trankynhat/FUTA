const express = require('express');
const { getTicketHistory, getTicketDetails } = require('../controllers/ticketController');
const router = express.Router();

router.get('/history', getTicketHistory);
router.get('/:ticketId', getTicketDetails);

module.exports = router;