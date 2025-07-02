const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProductService = async (productData) => {
  const {
    categoryId, subCategoryId, categoryTypeId, materialType, returnPolicy,
    careInstructions, productCode, productName, brand, price, totalStock,
    reducedPrice, availability, productDescription, Weight, Dimension,
    ShippingClass, metaTitle, metaDescription, keywords, selectedSizes,
    sizeStockMapping, userId
  } = productData;

  const parsedCategoryId = parseInt(categoryId);
  const parsedSubCategoryId = parseInt(subCategoryId);
  const parsedCategoryTypeId = parseInt(categoryTypeId);
  const parsedTotalStock = parseInt(totalStock);
  const parsedPrice = parseFloat(price);
  const parsedWeight = parseFloat(Weight);

  const existingProductCode = await prisma.product.findFirst({ where: { productCode } });
  if (existingProductCode) throw { status: 400, message: 'A product code already exists.', errorType: 'productExists' };

  const newProduct = await prisma.product.create({
    data: {
      productCode,
      productName,
      productDescription,
      price: parsedPrice,
      totalStock: parsedTotalStock,
      stockQuantity: parsedTotalStock,
      reorderLevel: parseInt(reducedPrice),
      availability,
      brand,
      materialType,
      createdBy: parseInt(userId),
      modifiedBy: parseInt(userId),
      categoryId: parsedCategoryId,
      subcategoryId: parsedSubCategoryId,
      categoryTypeId: parsedCategoryTypeId,
    }
  });

  const seoInformation = await prisma.sEOInformation.create({
    data: {
      productId: newProduct.productId,
      metaTitle,
      metaDescription,
      keywords,
      returnPolicy,
      careInstructions,
    }
  });

  const existingShippingInfo = await prisma.shippingInformation.findUnique({
    where: { productId: newProduct.productId },
  });

  const shippingInformation = existingShippingInfo || await prisma.shippingInformation.create({
    data: {
      productId: newProduct.productId,
      weight: parsedWeight,
      dimensions: Dimension,
      shippingClass: ShippingClass,
    }
  });

  if (Array.isArray(selectedSizes) && typeof sizeStockMapping === 'object') {
    const productSizes = selectedSizes.map(size => ({
      productId: newProduct.productId,
      sizeId: size,
      totalQuantity: sizeStockMapping[size] || 0,
      stockQuantity: sizeStockMapping[size] || 0,
    }));

    await prisma.productSize.createMany({ data: productSizes, skipDuplicates: true });
  }

  return { newProduct, seoInformation, shippingInformation };
};

const getAllProductsService = async () => {
  return await prisma.product.findMany({
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
  });
};

const getProductByIdService = async (id) => {
  const product = await prisma.product.findUnique({
    where: { productId: parseInt(id) },
    include: {
      seoInformation: true,
      shippingInformation: true,
      categoryType: true,
      mainCategory: true,
      subcategory: true,
      productSizes: true,
      productImages: true,
      productOffers: true,
    }
  });

  if (!product) return null;

  const productWithImages = {
    ...product,
    productImages: product.productImages.map(img => ({
      ...img,
      images: img.images ? img.images.toString('base64') : null
    })),
  };

  return productWithImages;
};

const getProductByCodeService = async (productCode) => {
  const product = await prisma.product.findUnique({
    where: { productCode },
    include: {
      seoInformation: true,
      shippingInformation: true,
      categoryType: true,
      mainCategory: true,
      subcategory: true,
      productSizes: true,
      productImages: true,
      productOffers: true,
    }
  });

  if (!product) return null;

  return {
    ...product,
    productImages: product.productImages.map(img => ({
      ...img,
      images: img.images ? img.images.toString('base64') : null
    }))
  };
};

const updateProductService = async (productId, data) => {
  const {
    categoryId, subCategoryId, categoryTypeId, materialType, returnPolicy,
    careInstructions, productCode, productName, brand, price, totalStock,
    reorderLevel, availability, productDescription, weight, dimension,
    shippingClass, metaTitle, metaDescription, keywords, selectedSizes,
    sizeStockMapping, userId
  } = data;

  const updatedProduct = await prisma.product.update({
    where: { productId },
    data: {
      productCode,
      productName,
      productDescription,
      price: parseFloat(price),
      totalStock: parseInt(totalStock),
      reorderLevel,
      availability,
      brand,
      materialType,
      modifiedBy: parseInt(userId),
      categoryId: parseInt(categoryId),
      subcategoryId: parseInt(subCategoryId),
      categoryTypeId: parseInt(categoryTypeId),
    }
  });

  const updatedSeoInformation = await prisma.sEOInformation.update({
    where: { productId },
    data: { metaTitle, metaDescription, keywords, returnPolicy, careInstructions }
  });

  const updatedShippingInformation = await prisma.shippingInformation.update({
    where: { productId },
    data: { weight: parseFloat(weight), dimensions: dimension, shippingClass }
  });

  if (Array.isArray(selectedSizes) && typeof sizeStockMapping === 'object') {
    await prisma.productSize.deleteMany({ where: { productId } });

    const newSizes = selectedSizes.map(size => ({
      productId,
      sizeId: size,
      totalQuantity: sizeStockMapping[size] || 0,
      stockQuantity: sizeStockMapping[size] || 0,
    }));

    await prisma.productSize.createMany({ data: newSizes, skipDuplicates: true });
  }

  return { updatedProduct, updatedSeoInformation, updatedShippingInformation };
};

const getProductsByCategoryTypeService = async (categoryTypeId) => {
  return await prisma.product.findMany({
    where: { categoryTypeId: parseInt(categoryTypeId) },
    include: {
      mainCategory: true,
      subcategory: true,
      categoryType: true,
      productImages: true,
    }
  });
};

module.exports = {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  getProductByCodeService,
  updateProductService,
  getProductsByCategoryTypeService
};
