const { getUserIdFromToken } = require('../authMiddleware');
const Ticket = require('../models/Ticket');

const getTicketHistory = async (req, res) => {
    const userId = getUserIdFromToken(req);
console.log(userId)
    try {
        const tickets = await Ticket.find({ user: userId }).populate('trip');
        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fetching ticket history failed!' });
    }
};

const getTicketDetails = async (req, res) => {
    /*try {
        const ticket = await Ticket.findById(req.params.ticketId).populate('trip');
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Vé không tồn tại' });
        }
        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin vé' });
    }*/

    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
        return res
            .status(404)
            .json({ success: false, message: "Ticket not found" });
        }

        res.json({ success: true, ticket });
    } catch (error) {
        console.error("Error fetching ticket details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getTicketHistory, getTicketDetails };