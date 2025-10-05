// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// exports.saveOrder = async (data) => {
//   const { deliveryInfo, products, totalAmount } = data;
//   const customerId = parseInt(data.userId);

//   return await prisma.$transaction(async (tx) => {
//     // 1. Save Address
//     const address = await tx.customerAddress.create({
//       data: {
//         customerId,
//         address: deliveryInfo.address,
//         city: deliveryInfo.city,
//         state: deliveryInfo.state,
//         zipCode: deliveryInfo.zipCode,
//         phone: deliveryInfo.phone,
//         paymentMethod: deliveryInfo.paymentMethod
//       }
//     });

//     // 2. Create Order
//     const order = await tx.order.create({
//       data: {
//         customerId,
//         addressId: address.customerAddressId,
//         totalAmount
//       }
//     });

//     // 3. Create Order Items
//     const orderItems = products.map(p => ({
//       orderId: order.orderId,
//       productId: p.productId,
//       quantity: p.quantity,
//       price: p.price,
//       discountPrice: p.discountPrice
//     }));

//     await tx.orderItem.createMany({ data: orderItems });

//     // 4. Delete AddToCart records for this customer
//     await tx.addToCart.deleteMany({
//       where: {
//         customerId: customerId
//       }
//     });

//     return {
//       orderId: order.orderId,
//       addressId: address.customerAddressId,
//       totalItems: orderItems.length
//     };
//   });
// };

const mongoose = require('mongoose');

// Import your Mongoose models
const CustomerAddress = require('../../../Models/Collections');
const Order = require('../../../Models/Collections');
const OrderItem = require('../../../Models/Collections');
const AddToCart = require('../../../Models/Collections');

exports.saveOrder = async (data) => {
  const { deliveryInfo, products, totalAmount } = data;
  const customerId = mongoose.Types.ObjectId(data.userId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Save Address
    const address = await CustomerAddress.create([{
      customerId,
      address: deliveryInfo.address,
      city: deliveryInfo.city,
      state: deliveryInfo.state,
      zipCode: deliveryInfo.zipCode,
      phone: deliveryInfo.phone,
      paymentMethod: deliveryInfo.paymentMethod
    }], { session });

    // 2. Create Order
    const order = await Order.create([{
      customerId,
      addressId: address[0]._id,
      totalAmount
    }], { session });

    // 3. Create Order Items
    const orderItems = products.map(p => ({
      orderId: order[0]._id,
      productId: mongoose.Types.ObjectId(p.productId),
      quantity: p.quantity,
      price: p.price,
      discountPrice: p.discountPrice
    }));

    await OrderItem.insertMany(orderItems, { session });

    // 4. Delete AddToCart records for this customer
    await AddToCart.deleteMany({ customerId }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      orderId: order[0]._id,
      addressId: address[0]._id,
      totalItems: orderItems.length
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
