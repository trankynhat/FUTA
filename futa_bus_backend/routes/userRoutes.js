const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../authMiddleware');
const { updateUser, getUser } = require('../controllers/userController');

router.get('/me', authMiddleware, getUser);
router.put('/update', authMiddleware, updateUser);

module.exports = router;