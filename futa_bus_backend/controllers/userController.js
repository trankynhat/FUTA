const User = require('../models/User');

const updateUser = async (req, res) => {
    const { fullName, phoneNumber, email } = req.body;
    const userId = req.users._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.email = email || user.email;

        await user.save();

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Update failed!' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.users._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get user!' });
    }
};

module.exports = { updateUser, getUser };