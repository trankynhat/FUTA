const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const crypto = require('crypto');
const qs = require('qs');

const makePayment = async (req, res) => {
    const { ticketId, amount, paymentMethod, bankCode } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Vé không tồn tại' });
        }

        const payment = new Payment({
            ticket: ticketId,
            amount,
            paymentMethod,
            status: "completed",
            bankCode
        });

        await payment.save();

        res.json({ success: true, payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Payment failed!' });
    }
};

const getPayment = async (req, res) => {
    try {
        const payments = await Payment.find().populate('ticket');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Payment failed !' });
    }
}

const vnp_TmnCode = '8BSZ1ILG';
const vnp_HashSecret = '8MCQKJ5SD9WE5HJWOF16WT81UBDG2Z2Y';
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const vnp_ReturnUrl = 'http://localhost:3000/vnpay_return';

const createPaymentURL = async (req, res) => {
    const { amount, orderId, orderInfo, bankCode } = req.body;
    try {
      let vnpUrl = vnp_Url;
      const date = new Date();
      const createDate = date.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const orderIdStr = `T${createDate}${orderId}`;
  
      const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  
      const tmnCode = vnp_TmnCode;
      const secretKey = vnp_HashSecret;
      const returnUrl = vnp_ReturnUrl;
  
      const locale = 'vn';
      const currCode = 'VND';
  
      //const vnp_Params = {
        /*vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderIdStr,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'billpayment',
        vnp_Amount: amount * 100, // Số tiền cần thanh toán
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,*/
        /*vnp_Amount: amount * 100, // Số tiền cần thanh toán
        vnp_Command: 'pay',
        vnp_CreateDate: createDate,
        vnp_CurrCode: currCode,
        vnp_IpAddr: ipAddr,
        vnp_Locale: locale,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'billpayment',
        vnp_ReturnUrl: returnUrl,
        vnp_TmnCode: tmnCode,
        vnp_TxnRef: orderIdStr,
        vnp_Version: '2.1.0',
      };
  
      if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
      }*/

      const vnp_Params = {
        vnp_Amount: amount * 100, // Số tiền cần thanh toán
      };
  
      if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
      }

      vnp_Params['vnp_Command'] = 'pay',
      vnp_Params['vnp_CreateDate'] = createDate,
      vnp_Params['vnp_CurrCode'] = currCode,
      vnp_Params['vnp_IpAddr'] = ipAddr,
      vnp_Params['vnp_Locale'] = locale,
      vnp_Params['vnp_OrderInfo'] = orderInfo,
      vnp_Params['vnp_OrderType'] = 'billpayment',
      vnp_Params['vnp_ReturnUrl'] = returnUrl,
      vnp_Params['vnp_TmnCode'] = tmnCode,
      vnp_Params['vnp_TxnRef'] = orderIdStr,
      vnp_Params['vnp_Version'] = '2.1.0',
  
      vnp_Params['vnp_SecureHashType'] = 'sha512';
      vnp_Params['vnp_SecureHash'] = crypto.createHmac('sha512', secretKey).update(qs.stringify(vnp_Params)).digest('hex');
  
      vnpUrl += '?' + qs.stringify(vnp_Params);
      res.status(200).json({ paymentUrl: vnpUrl });
    } catch (error) {
      console.error('Error in create_payment_url:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const vnpayReturn = async (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
  
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
  
    const secretKey = vnp_HashSecret;
    const querystring = require('qs');
    const crypto = require('crypto');
  
    const signData = querystring.stringify(vnp_Params);
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
    if (secureHash === signed) {
        // Kiểm tra trạng thái giao dịch
        const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
        if (vnp_ResponseCode === '00') {
            // Giao dịch thành công
            res.json({ success: true, message: 'Thanh toán thành công!' });
        } else {
            // Giao dịch thất bại
            res.json({ success: false, message: 'Thanh toán thất bại!' });
        }
    } else {
        res.json({ success: false, message: 'Chữ ký không hợp lệ!' });
    }
};

module.exports = { makePayment, getPayment, createPaymentURL, vnpayReturn };