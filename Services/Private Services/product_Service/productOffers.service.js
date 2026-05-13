// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // Delete expired offers for the given product
// const deleteExpiredOffers = async (productId, today) => {
//   return await prisma.productOffer.deleteMany({
//     where: {
//       productId: productId,
//       endDate: { lte: today },
//     },
//   });
// };

// // Check if an active offer already exists for a product
// const checkExistingActiveOffer = async (productId, today) => {
//   return await prisma.productOffer.findFirst({
//     where: {
//       productId: productId,
//       endDate: { gt: today },
//     },
//   });
// };

// // Create new product offer
// const createNewOffer = async (data) => {
//   return await prisma.productOffer.create({ data });
// };

// // Get product offer by product ID
// const getOfferByProductId = async (productId) => {
//   return await prisma.productOffer.findFirst({
//     where: { productId: parseInt(productId) },
//   });
// };

// module.exports = {
//   deleteExpiredOffers,
//   checkExistingActiveOffer,
//   createNewOffer,
//   getOfferByProductId,
// };

// services/productOfferService.js
const { ProductOffer } = require("../../../Models/Collections");

// Delete expired offers for the given product
const deleteExpiredOffers = async (productId, today) => {
  return await ProductOffer.deleteMany({
    productId: productId,
    endDate: { $lt: today },
  });
};

// Check if an active offer already exists for a product
const checkExistingActiveOffer = async (productId, today) => {
  // const pid = parseInt(productId, 10);
  return await ProductOffer.findOne({
    productId: productId,
    endDate: { $gt: today },
  }).sort({ endDate: -1 });
};

// Create new product offer
const createNewOffer = async (data) => {
  const offer = new ProductOffer(data);
  return await offer.save();
};

// Get product offer by product ID
const getOfferByProductId = async (productId) => {
  // const pid = parseInt(productId, 10);
  return await ProductOffer.findOne({ productId: productId }).sort({
    endDate: -1,
  });
};

module.exports = {
  deleteExpiredOffers,
  checkExistingActiveOffer,
  createNewOffer,
  getOfferByProductId,
};
