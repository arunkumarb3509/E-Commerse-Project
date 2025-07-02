const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addToCartService = async (productId, guestUserId) => {
  const parsedProductId = parseInt(productId);

  const existingProduct = await prisma.product.findUnique({
    where: { productId: parsedProductId },
  });

  if (!existingProduct) throw { status: 404, message: "Product not found." };

  const existingCartItem = await prisma.addToCart.findFirst({
    where: { productId: parsedProductId, guestUserId },
  });

  if (existingCartItem) return { exists: true };

  const existingSavedItem = await prisma.customerSavedOrder.findFirst({
    where: { productId: parsedProductId, guestUserId },
  });

  if (existingSavedItem) return { saved: true };

  const newCartItem = await prisma.addToCart.create({
    data: {
      productId: parsedProductId,
      customerId: null,
      guestUserId,
      createdAt: "customer",
      modifiedAt: "customer",
    },
  });

  return { added: true, cart: newCartItem };
};

const getCartItemsByGuestUserIdService = async (guestUserId) => {
  return prisma.addToCart.findMany({
    where: { guestUserId },
    include: {
      product: {
        include: {
          subcategory: true,
          mainCategory: true,
          productImages: true,
          productSizes: true,
          seoInformation: true,
          shippingInformation: true,
          categoryType: true,
          productOffers: true,
        },
      },
    },
  });
};

const removeItemFromCartService = async (productId) => {
  const productIdInt = parseInt(productId);
  return prisma.addToCart.deleteMany({ where: { productId: productIdInt } });
};

const saveItemForLaterService = async (productId, guestUserId) => {
  const parsedProductId = parseInt(productId);

  const productExists = await prisma.product.findUnique({
    where: { productId: parsedProductId },
  });

  if (!productExists) throw { status: 404, message: "Product not found." };

  const alreadySaved = await prisma.customerSavedOrder.findFirst({
    where: { productId: parsedProductId, guestUserId },
  });

  if (alreadySaved) throw { status: 409, message: "Product already saved." };

  await prisma.customerSavedOrder.create({
    data: {
      product: { connect: { productId: parsedProductId } },
      guestUserId,
    },
  });

  await prisma.addToCart.deleteMany({
    where: { productId: parsedProductId, guestUserId },
  });

  return true;
};

const moveToCartService = async (productId, guestUserId) => {
  const parsedProductId = parseInt(productId);

  const existingCartItem = await prisma.addToCart.findFirst({
    where: { productId: parsedProductId, guestUserId },
  });

  if (existingCartItem) return { alreadyInCart: true };

  const existingSavedItem = await prisma.customerSavedOrder.findFirst({
    where: { productId: parsedProductId, guestUserId },
  });

  if (!existingSavedItem) throw { status: 404, message: "Product not in saved items." };

  await prisma.addToCart.create({
    data: {
      productId: parsedProductId,
      customerId: null,
      guestUserId,
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdAt: "customer",
      modifiedAt: "customer",
    },
  });

  await prisma.customerSavedOrder.deleteMany({
    where: { productId: parsedProductId, guestUserId },
  });

  return true;
};

const getSavedItemsService = async (guestUserId) => {
  return prisma.customerSavedOrder.findMany({
    where: { guestUserId },
    include: {
      product: {
        include: {
          subcategory: true,
          mainCategory: true,
          productImages: true,
          productSizes: true,
          seoInformation: true,
          shippingInformation: true,
          categoryType: true,
          productOffers: true,
        },
      },
    },
    orderBy: {
      createdDate: 'desc',
    },
  });
};

const removeSavedItemService = async (productId) => {
  const productIdInt = parseInt(productId);
  return prisma.customerSavedOrder.deleteMany({
    where: { productId: productIdInt },
  });
};

const getCustomerCartItemsService = async (customerId) => {
  const parsedCustomerId = parseInt(customerId);
  return prisma.addToCart.findMany({
    where: { customerId: parsedCustomerId },
    include: {
      product: {
        include: {
          subcategory: true,
          mainCategory: true,
          productImages: true,
          productSizes: true,
          seoInformation: true,
          shippingInformation: true,
          categoryType: true,
          productOffers: true,
        },
      },
    },
  });
};

module.exports = {
  addToCartService,
  getCartItemsByGuestUserIdService,
  removeItemFromCartService,
  saveItemForLaterService,
  moveToCartService,
  getSavedItemsService,
  removeSavedItemService,
  getCustomerCartItemsService,
};
