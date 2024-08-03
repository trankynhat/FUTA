const jwt = require('jsonwebtoken');
const User = require('./models/User');

const authMiddleware = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.users = await User.findById(decoded._id).select('-password');

            if (!req.users) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
const getUserIdFromToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('check', decoded)
            return decoded.userId; // Trả về userId từ payload
        } catch (error) {
            throw new Error('Invalid token');
        }
    } else {
        throw new Error('No token provided');
    }
};
module.exports = { authMiddleware, getUserIdFromToken };