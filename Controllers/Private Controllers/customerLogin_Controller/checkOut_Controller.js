const orderService = require('../../../Services/Private Services/customerLogin_Service/checkOut.service');

const createSession = async (req, res) => {
  try {
    const payload = req.body; // { customerId, guestUserId, products: [{productId, quantity}] }
    
    const result = await orderService.createOrderSession(payload);

    // return session id, razorpay order, amount and public key
    res.status(201).json({
      success: true,
      message: 'Order session created',
      sessionId: result.session._id,
      razorpayOrder: result.razorpayOrder,
      amount: result.session.totalAmount,
      currency: result.session.currency,
      razorpayKeyId: result.keyId
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { sessionId, razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = req.body;
    console.log(req.body);
    
    if (!sessionId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing verification params' });
    }

    const valid = orderService.verifyRazorpaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid signature' });

    const order = await orderService.placeOrderFromSession(sessionId, { razorpay_order_id, razorpay_payment_id }, address);

    res.json({ success: true, message: 'Payment verified and order created', orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Verification failed' });
  }
};

const finalizeCOD = async (req, res) => {
  try {
    const { sessionId, address } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: 'sessionId required' });

    const order = await orderService.finalizeCOD(sessionId, address);

    res.json({ success: true, message: 'COD order placed', orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: err.message || 'COD finalize failed' });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    console.log(customerId+"cust id");
    
    const orders = await orderService.getOrdersByCustomer(customerId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No orders found" 
      });
    }

    res.json({ success: true, data: orders });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    res.json({ success: true, data: order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSession,
  verifyPayment,
  finalizeCOD,
  getOrdersByCustomer,
  getOrderById
};