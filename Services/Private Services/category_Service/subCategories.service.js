const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const validateMainCategory = async (id) => {
  return await prisma.mainCategory.findUnique({
    where: { categoryId: parseInt(id, 10) },
  });
};

const validateCategoryType = async (id) => {
  return await prisma.categoryType.findUnique({
    where: { categoryTypeId: parseInt(id, 10) },
  });
};

const saveImageToFileSystem = (image) => {
  const fileExtension = path.extname(image.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const directoryPath = path.join(__dirname, '../../../assets', 'SubCategoryImages');
  const filePath = path.join(directoryPath, fileName);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFileSync(filePath, image.buffer);

  return {
    imageBuffer: image.buffer,
    filePath,
  };
};

const createSubCategory = async (data) => {
  return await prisma.subCategory.create({ data });
};

const updateSubCategory = async (id, data) => {
  return await prisma.subCategory.update({
    where: { subCategoryId: parseInt(id, 10) },
    data,
  });
};

const findAllSubCategories = async () => {
  return await prisma.subCategory.findMany({
    select: {
      subCategoryId: true,
      subCategoryName: true,
      description: true,
      images: true,
      createdAt: true,
      updatedAt: true,
      mainCategory: {
        select: {
          categoryName: true,
        },
      },
    },
  });
};

const findSubCategoryById = async (id) => {
  return await prisma.subCategory.findUnique({
    where: { subCategoryId: parseInt(id, 10) },
    include: {
      mainCategory: true,
    },
  });
};

const findAllCategoryTypes = async () => {
  return await prisma.categoryType.findMany({
    select: {
      categoryTypeId: true,
      typeName: true,
    },
  });
};

module.exports = {
  validateMainCategory,
  validateCategoryType,
  saveImageToFileSystem,
  createSubCategory,
  updateSubCategory,
  findAllSubCategories,
  findSubCategoryById,
  findAllCategoryTypes,
};
