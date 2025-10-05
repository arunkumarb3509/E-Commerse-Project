const orderService = require('../../../Services/Private Services/customerLogin_Service/customerOrder.service');

const submitOrder = async (req, res) => {
  try {
    const orderData = req.body;
    console.log(orderData);
    
    const savedOrder = await orderService.saveOrder(orderData);
    res.status(201).json({ message: 'Order placed successfully', data: savedOrder });
  } catch (err) {
    console.error('Order Save Error:', err);
    res.status(500).json({ message: 'Failed to save order' });
  }
};

module.exports = {
  submitOrder,
};