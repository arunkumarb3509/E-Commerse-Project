// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const addToCartService = async (productId, guestUserId) => {
//   const parsedProductId = parseInt(productId);

//   const existingProduct = await prisma.product.findUnique({
//     where: { productId: parsedProductId },
//   });

//   if (!existingProduct) throw { status: 404, message: "Product not found." };

//   const existingCartItem = await prisma.addToCart.findFirst({
//     where: { productId: parsedProductId, guestUserId },
//   });

//   if (existingCartItem) return { exists: true };

//   const existingSavedItem = await prisma.customerSavedOrder.findFirst({
//     where: { productId: parsedProductId, guestUserId },
//   });

//   if (existingSavedItem) return { saved: true };

//   const newCartItem = await prisma.addToCart.create({
//     data: {
//       productId: parsedProductId,
//       customerId: null,
//       guestUserId,
//       createdAt: "customer",
//       modifiedAt: "customer",
//     },
//   });

//   return { added: true, cart: newCartItem };
// };

// const getCartItemsByGuestUserIdService = async (guestUserId) => {
//   return prisma.addToCart.findMany({
//     where: { guestUserId },
//     include: {
//       product: {
//         include: {
//           subcategory: true,
//           mainCategory: true,
//           productImages: true,
//           productSizes: true,
//           seoInformation: true,
//           shippingInformation: true,
//           categoryType: true,
//           productOffers: true,
//         },
//       },
//     },
//   });
// };

// const removeItemFromCartService = async (productId) => {
//   const productIdInt = parseInt(productId);
//   return prisma.addToCart.deleteMany({ where: { productId: productIdInt } });
// };

// const saveItemForLaterService = async (productId, guestUserId) => {
//   const parsedProductId = parseInt(productId);

//   const productExists = await prisma.product.findUnique({
//     where: { productId: parsedProductId },
//   });

//   if (!productExists) throw { status: 404, message: "Product not found." };

//   const alreadySaved = await prisma.customerSavedOrder.findFirst({
//     where: { productId: parsedProductId, guestUserId },
//   });

//   if (alreadySaved) throw { status: 409, message: "Product already saved." };

//   await prisma.customerSavedOrder.create({
//     data: {
//       product: { connect: { productId: parsedProductId } },
//       guestUserId,
//     },
//   });

//   await prisma.addToCart.deleteMany({
//     where: { productId: parsedProductId, guestUserId },
//   });

//   return true;
// };

// const moveToCartService = async (productId, guestUserId) => {
//   const parsedProductId = parseInt(productId);

//   const existingCartItem = await prisma.addToCart.findFirst({
//     where: { productId: parsedProductId, guestUserId },
//   });

//   if (existingCartItem) return { alreadyInCart: true };

//   const existingSavedItem = await prisma.customerSavedOrder.findFirst({
//     where: { productId: parsedProductId, guestUserId },
//   });

//   if (!existingSavedItem) throw { status: 404, message: "Product not in saved items." };

//   await prisma.addToCart.create({
//     data: {
//       productId: parsedProductId,
//       customerId: null,
//       guestUserId,
//       createdDate: new Date(),
//       modifiedDate: new Date(),
//       createdAt: "customer",
//       modifiedAt: "customer",
//     },
//   });

//   await prisma.customerSavedOrder.deleteMany({
//     where: { productId: parsedProductId, guestUserId },
//   });

//   return true;
// };

// const getSavedItemsService = async (guestUserId) => {
//   return prisma.customerSavedOrder.findMany({
//     where: { guestUserId },
//     include: {
//       product: {
//         include: {
//           subcategory: true,
//           mainCategory: true,
//           productImages: true,
//           productSizes: true,
//           seoInformation: true,
//           shippingInformation: true,
//           categoryType: true,
//           productOffers: true,
//         },
//       },
//     },
//     orderBy: {
//       createdDate: 'desc',
//     },
//   });
// };

// const removeSavedItemService = async (productId) => {
//   const productIdInt = parseInt(productId);
//   return prisma.customerSavedOrder.deleteMany({
//     where: { productId: productIdInt },
//   });
// };

// const getCustomerCartItemsService = async (customerId) => {
//   const parsedCustomerId = parseInt(customerId);
//   return prisma.addToCart.findMany({
//     where: { customerId: parsedCustomerId },
//     include: {
//       product: {
//         include: {
//           subcategory: true,
//           mainCategory: true,
//           productImages: true,
//           productSizes: true,
//           seoInformation: true,
//           shippingInformation: true,
//           categoryType: true,
//           productOffers: true,
//         },
//       },
//     },
//   });
// };

// module.exports = {
//   addToCartService,
//   getCartItemsByGuestUserIdService,
//   removeItemFromCartService,
//   saveItemForLaterService,
//   moveToCartService,
//   getSavedItemsService,
//   removeSavedItemService,
//   getCustomerCartItemsService,
// };

const {
  Product,
  AddToCart,
  CustomerSavedOrder,
} = require('../../../Models/Collections'); // Adjust path as needed

// const addToCartService = async (productId, guestUserId) => {
//   // const parsedProductId = parseInt(productId);
// console.log(productId,guestUserId);

//   const existingProduct = await Product.findById(productId);
//   if (!existingProduct) throw { status: 404, message: "Product not found." };

//   const existingCartItem = await AddToCart.findById({ _id: productId, guestUserId });
//   if (existingCartItem) return { exists: true };
//  console.log("existingCart"+ existingCartItem);
 
//   const existingSavedItem = await CustomerSavedOrder.findOne({ _id: productId, guestUserId });
//   if (existingSavedItem) return { saved: true };
//  console.log("existingSavedItem"+ existingSavedItem);
//   const newCartItem = await AddToCart.create({
//     productId: productId,
//     customerId: null,
//     guestUserId,
//     createdAt: "customer",
//     modifiedAt: "customer",
//   });

//   return { added: true, cart: newCartItem };
// };

// const getCartItemsByGuestUserIdService = async (guestUserId) => {
//   console.log(guestUserId+"empty");
  
//   return AddToCart.find({ guestUserId }).populate({
//     path: 'productId',
//     populate: [
//       'subcategory',
//       'mainCategory',
//       'productImages',
//       'productSizes',
//       'seoInformation',
//       'shippingInformation',
//       'categoryType',
//       'productOffers',
//     ],
//   });
// };

const addToCartService = async (productId, guestUserId) => {

  const existingProduct = await Product.findById(productId);
  if (!existingProduct) throw { status: 404, message: "Product not found." };

  // CHECK CART ITEM CORRECTLY
  const existingCartItem = await AddToCart.findOne({ productId, guestUserId });

  if (existingCartItem) return { exists: true };

  // CHECK SAVED ITEM CORRECTLY
  const existingSavedItem = await CustomerSavedOrder.findOne({ productId, guestUserId });

  if (existingSavedItem) return { saved: true };

  const newCartItem = await AddToCart.create({
    productId,
    customerId: null,
    guestUserId,
    createdAt: new Date(),
    modifiedAt: new Date(),
  });

  return { added: true, cart: newCartItem };
};

const getCartItemsByGuestUserIdService = async (guestUserId) => {
  try {

    return await AddToCart.find({ guestUserId }).populate({
      path: 'productId',
      populate: [
        { path: 'subcategoryId' },
        { path: 'categoryId' },
        { path: 'categoryTypeId' },
        { path: 'productImages' },
        { path: 'productSizes' },
        { path: 'seoInformation' },
        { path: 'shippingInformation' },
        { path: 'productOffers' }
      ]
    });

  } catch (error) {
    console.error("Populate Error:", error);
    throw error;
  }
};

// const getCartItemsByGuestUserIdService = async (guestUserId) => {
//   try {
//     console.log("guestUserId:", guestUserId);

//     return await AddToCart.find({ guestUserId }).populate({
//       path: 'productId',
//       populate: [
//         'subcategory',
//         'mainCategory',
//         'productImages',
//         'productSizes',
//         'seoInformation',
//         'shippingInformation',
//         'categoryType',
//         'productOffers',
//       ],
//     });
//   } catch (error) {
//     console.error("Populate Error:", error);
//     throw error;
//   }
// };

const removeItemFromCartService = async (productId) => {
  // const productIdInt = parseInt(productId);
  // return AddToCart.deleteMany( productId );
  return AddToCart.deleteMany({ productId });
};

const saveItemForLaterService = async (productId, guestUserId) => {
  // const parsedProductId = parseInt(productId);

  // const productExists = await Product.findOne( productId );
  const productExists = await Product.findOne({ _id: productId });
  if (!productExists) throw { status: 404, message: "Product not found." };

  const alreadySaved = await CustomerSavedOrder.findOne({ productId, guestUserId });
  if (alreadySaved) throw { status: 409, message: "Product already saved." };

  await CustomerSavedOrder.create({ productId, guestUserId });

  await AddToCart.deleteMany({ productId, guestUserId });

  return true;
};

const moveToCartService = async (productId, guestUserId) => {
  // const parsedProductId = parseInt(productId);

  const existingCartItem = await AddToCart.findOne({ productId, guestUserId });
  if (existingCartItem) return { alreadyInCart: true };

  const existingSavedItem = await CustomerSavedOrder.findOne({ productId, guestUserId });
  if (!existingSavedItem) throw { status: 404, message: "Product not in saved items." };

  await AddToCart.create({
    productId: productId,
    customerId: null,
    guestUserId,
    createdDate: new Date(),
    modifiedDate: new Date(),
    createdAt: "customer",
    modifiedAt: "customer",
  });

  await CustomerSavedOrder.deleteMany({productId, guestUserId });

  return true;
};

const getSavedItemsService = async (guestUserId) => {
  return CustomerSavedOrder.find({ guestUserId })
    .populate({
      path: 'productId',
      // populate: [
      //   'subcategory',
      //   'mainCategory',
      //   'productImages',
      //   'productSizes',
      //   'seoInformation',
      //   'shippingInformation',
      //   'categoryType',
      //   'productOffers',
      // ],
        populate: [
        { path: 'subcategoryId' },
        { path: 'categoryId' },
        { path: 'categoryTypeId' },
        { path: 'productImages' },
        { path: 'productSizes' },
        { path: 'seoInformation' },
        { path: 'shippingInformation' },
        { path: 'productOffers' }
      ]
    })
    .sort({ createdDate: -1 });
};

const removeSavedItemService = async (productId) => {
  const productIdInt = parseInt(productId);
  return CustomerSavedOrder.deleteMany({ productId: productIdInt });
};

const getCustomerCartItemsService = async (customerId) => {
  const parsedCustomerId = parseInt(customerId);
  return AddToCart.find({ customerId: parsedCustomerId }).populate({
    path: 'productId',
    // populate: [
    //   'subcategory',
    //   'mainCategory',
    //   'productImages',
    //   'productSizes',
    //   'seoInformation',
    //   'shippingInformation',
    //   'categoryType',
    //   'productOffers',
    // ],
    populate: [
        { path: 'subcategoryId' },
        { path: 'categoryId' },
        { path: 'categoryTypeId' },
        { path: 'productImages' },
        { path: 'productSizes' },
        { path: 'seoInformation' },
        { path: 'shippingInformation' },
        { path: 'productOffers' }
      ]
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
