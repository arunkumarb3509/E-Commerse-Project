const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Delete expired offers for the given product
const deleteExpiredOffers = async (productId, today) => {
  return await prisma.productOffer.deleteMany({
    where: {
      productId: productId,
      endDate: { lte: today },
    },
  });
};

// Check if an active offer already exists for a product
const checkExistingActiveOffer = async (productId, today) => {
  return await prisma.productOffer.findFirst({
    where: {
      productId: productId,
      endDate: { gt: today },
    },
  });
};

// Create new product offer
const createNewOffer = async (data) => {
  return await prisma.productOffer.create({ data });
};

// Get product offer by product ID
const getOfferByProductId = async (productId) => {
  return await prisma.productOffer.findFirst({
    where: { productId: parseInt(productId) },
  });
};

module.exports = {
  deleteExpiredOffers,
  checkExistingActiveOffer,
  createNewOffer,
  getOfferByProductId,
};
