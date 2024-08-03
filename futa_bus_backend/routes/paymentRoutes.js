const express = require('express');
const { makePayment, getPayment, createPaymentURL, vnpayReturn } = require('../controllers/paymentController');
const router = express.Router();

router.post('/', makePayment);
router.get('/', getPayment);
router.post('/create_payment_url', createPaymentURL);
router.get('/vnpay_return', vnpayReturn);

module.exports = router;