const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require('dotenv');
// const config = require("../config");
// const Product = require('../models/Product');
const {
  OrderSession,
  Product,
  Order,
  AddToCart,
} = require("../../../Models/Collections");
// const Order = require('../models/Order');
// const AddToCart = require('../models/AddToCart');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


/**
 * Create Order Session: validate products, lock prices, create session & razorpay order
 * payload: { customerId, guestUserId, products: [{productId, quantity}] }
 */
async function createOrderSession(payload) {
  const { customerId, guestUserId, products } = payload;

  if (!products || products.length === 0)
    throw { status: 400, message: "No products provided." };

  const items = [];
  let total = 0;

  for (const p of products) {
    const prod = await Product.findById(p.productId);
    if (!prod)
      throw { status: 404, message: `Product ${p.productId} not found` };

    const discountPrice =
      (prod.productOffers &&
        prod.productOffers[0] &&
        prod.productOffers[0].discountPrice) ||
      prod.price ||
      0;
    const lockedPrice = discountPrice;
    const qty = p.quantity || 1;

    items.push({
      productId: prod._id,
      name: prod.productName,
      price: prod.price,
      discountPrice,
      quantity: qty,
      lockedPrice,
    });

    total += lockedPrice * qty;
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

  const session = new OrderSession({
    customerId: customerId || null,
    guestUserId: guestUserId || null,
    items,
    totalAmount: total,
    currency: "INR",
    expiresAt,
  });

  await session.save();

  // create razorpay order
  const rOptions = {
    amount: Math.round(total * 100), // amount in paise
    currency: "INR",
    receipt: `order_session_${session._id}`,
    payment_capture: 1,
  };

  const rOrder = await razorpay.orders.create(rOptions);

  session.razorpayOrderId = rOrder.id;
  await session.save();

  return {
    session,
    razorpayOrder: rOrder,
    keyId: process.env.RAZORPAY_KEY_ID,
  };

}

/**
 * Verify signature: returns boolean
 */
function verifyRazorpaySignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const generated_signature = crypto
    .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return generated_signature === razorpay_signature;
}

/**
 * Place Order (finalize): convert OrderSession -> Order; clear cart
 */
async function placeOrderFromSession(sessionId, paymentInfo, address) {
  const session = await OrderSession.findById(sessionId);
  if (!session) throw { status: 404, message: "Order session not found" };
  if (session.status !== "CREATED")
    throw { status: 400, message: "Session is not active" };
  if (new Date() > session.expiresAt) {
    session.status = "EXPIRED";
    await session.save();
    throw { status: 410, message: "Order session expired" };
  }

  // mark session as PAID
  session.status = "PAID";
  await session.save();

  // create final Order
  const order = new Order({
    customerId: session.customerId,
    guestUserId: session.guestUserId,
    items: session.items.map((it) => ({
      productId: it.productId,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      discountPrice: it.discountPrice,
    })),
    payment: {
      provider: paymentInfo.provider || "razorpay",
      paymentId:
        paymentInfo.razorpay_payment_id || paymentInfo.paymentId || null,
      razorpayOrderId:
        paymentInfo.razorpay_order_id || session.razorpayOrderId || null,
      method: paymentInfo.method || "Online",
      status: paymentInfo.status || "PAID",
    },
    totalAmount: session.totalAmount,
    address: address || {},
    status: "Order Placed",
    createdAt: new Date(),
  });

  await order.save();

  // clear cart items for this user/session
  if (session.customerId) {
    await AddToCart.deleteMany({ customerId: session.customerId });
  } else if (session.guestUserId) {
    await AddToCart.deleteMany({ guestUserId: session.guestUserId });
  }

  return order;
}

/**
 * Finalize COD: convert session to final order (no signature verification)
 */
async function finalizeCOD(sessionId, address) {
  const session = await OrderSession.findById(sessionId);
  if (!session) throw { status: 404, message: "Order session not found" };
  if (session.status !== "CREATED")
    throw { status: 400, message: "Session is not active" };
  if (new Date() > session.expiresAt) {
    session.status = "EXPIRED";
    await session.save();
    throw { status: 410, message: "Order session expired" };
  }

  // mark session as PAID? For COD, we can mark as PAID=false but status Order Placed. Here set to PAID to avoid reuse.
  session.status = "PAID";
  await session.save();

  const order = new Order({
    customerId: session.customerId,
    guestUserId: session.guestUserId,
    items: session.items,
    payment: {
      provider: "COD",
      paymentId: null,
      razorpayOrderId: null,
      method: "COD",
      status: "PENDING",
    },
    totalAmount: session.totalAmount,
    address: address || {},
    status: "Order Placed",
    createdAt: new Date(),
  });

  await order.save();

  // clear cart
  if (session.customerId) {
    await AddToCart.deleteMany({ customerId: session.customerId });
  } else if (session.guestUserId) {
    await AddToCart.deleteMany({ guestUserId: session.guestUserId });
  }

  return order;
}


// 1. Get all orders for customer
async function getOrdersByCustomer(customerId) {
  return await Order.find({ customerId })
    .sort({ createdDate: -1 })
    .lean();
}

// 2. Get single order details
async function getOrderById(orderId) {
  return await Order.findById(orderId).lean();
}

module.exports = {
  createOrderSession,
  verifyRazorpaySignature,
  placeOrderFromSession,
  finalizeCOD,
  getOrdersByCustomer,
  getOrderById
};
