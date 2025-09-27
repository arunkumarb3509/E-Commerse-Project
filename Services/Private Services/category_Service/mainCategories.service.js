const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// const findAllMainCategories = async () => {
//   return await prisma.mainCategory.findMany();
// };
const findAllMainCategories = async (limit, offset) => {
  const [categories, total] = await Promise.all([
    prisma.mainCategory.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.mainCategory.count()
  ]);

  return { categories, total };
};


const findMainCategoryByIdWithDetails = async (id) => {
  return await prisma.mainCategory.findUnique({
    where: { categoryId: parseInt(id, 10) },
    include: {
      subCategories: {
        include: {
          categoryType: true,
        },
      },
    },
  });
};

const findMainCategoryByName = async (name) => {
  return await prisma.mainCategory.findUnique({
    where: { categoryName: name },
  });
};

const createMainCategory = async (name, description) => {
  return await prisma.mainCategory.create({
    data: {
      categoryName: name,
      description: description,
    },
  });
};

const updateMainCategoryById = async (id, name, description) => {
  return await prisma.mainCategory.update({
    where: { categoryId: parseInt(id, 10) },
    data: {
      categoryName: name,
      description: description,
    },
  });
};

const deleteSubCategoriesByMainCategoryId = async (mainCategoryId) => {
  return await prisma.subCategory.deleteMany({
    where: { mainCategoryId: parseInt(mainCategoryId, 10) },
  });
};

const deleteMainCategoryById = async (id) => {
  return await prisma.mainCategory.delete({
    where: { categoryId: parseInt(id, 10) },
  });
};

module.exports = {
  findAllMainCategories,
  findMainCategoryByIdWithDetails,
  findMainCategoryByName,
  createMainCategory,
  updateMainCategoryById,
  deleteSubCategoriesByMainCategoryId,
  deleteMainCategoryById,
};
