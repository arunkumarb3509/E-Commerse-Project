// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const findAllMainCategories = async () => {
//   return await prisma.mainCategory.findMany();
// };

// const findMainCategoryByIdWithDetails = async (id) => {
//   return await prisma.mainCategory.findUnique({
//     where: { categoryId: parseInt(id, 10) },
//     include: {
//       subCategories: {
//         include: {
//           categoryType: true,
//         },
//       },
//     },
//   });
// };

// const findMainCategoryByName = async (name) => {
//   return await prisma.mainCategory.findUnique({
//     where: { categoryName: name },
//   });
// };

// const createMainCategory = async (name, description) => {
//   return await prisma.mainCategory.create({
//     data: {
//       categoryName: name,
//       description: description,
//     },
//   });
// };

// const updateMainCategoryById = async (id, name, description) => {
//   return await prisma.mainCategory.update({
//     where: { categoryId: parseInt(id, 10) },
//     data: {
//       categoryName: name,
//       description: description,
//     },
//   });
// };

// const deleteSubCategoriesByMainCategoryId = async (mainCategoryId) => {
//   return await prisma.subCategory.deleteMany({
//     where: { mainCategoryId: parseInt(mainCategoryId, 10) },
//   });
// };

// const deleteMainCategoryById = async (id) => {
//   return await prisma.mainCategory.delete({
//     where: { categoryId: parseInt(id, 10) },
//   });
// };

// module.exports = {
//   findAllMainCategories,
//   findMainCategoryByIdWithDetails,
//   findMainCategoryByName,
//   createMainCategory,
//   updateMainCategoryById,
//   deleteSubCategoriesByMainCategoryId,
//   deleteMainCategoryById,
// };

const { MainCategory } = require("../../../Models/Collections");
const { SubCategory } = require("../../../Models/Collections");

const findAllMainCategories = async () => {
  // return await MainCategory.find()
  //  .populate({
  //     path: 'subCategories',           // populate subCategories field
  //     select: 'subCategoryName description images createdAt updatedAt', // fields to return
  //   })
  //   .lean(); // returns plain JS objects instead of Mongoose docs
  return await MainCategory.find({}, 'categoryName _id description createdAt updatedAt').lean();
}

const findMainCategoryByIdWithDetails = async (id) => {
  return await MainCategory.findById(id)
    .populate({
      path: 'subCategories',
      populate: {
        path: 'categoryTypeInfo',
        model: 'CategoryType',
      },
    });
};

const findSubCategoryByCategoryId = async (categoryId) => {
  return await SubCategory.find({ categoryId })  // ✅ use find(), not findById()
    .populate({
      path: 'categoryId',
      model: 'MainCategory',
      select: 'categoryName description'
    })
    .populate({
      path: 'categoryTypeInfo',
      model: 'CategoryType',
      select: 'categoryTypeId typeName'
    });
};


const findMainCategoryByName = async (name) => {
  return await MainCategory.findOne({ categoryName: name });
};

const createMainCategory = async (userId, name, description) => {
  return await MainCategory.create({
    categoryName: name,
    description: description,
    userId: userId,
  });
};

const updateMainCategoryById = async (id, name, description) => {
  return await MainCategory.findByIdAndUpdate(
    id,
    { categoryName: name, description: description },
    { new: true }
  );
};

const deleteSubCategoriesByMainCategoryId = async (mainCategoryId) => {
  return await SubCategory.deleteMany({ mainCategoryId });
};

const deleteMainCategoryById = async (id) => {
  return await MainCategory.findByIdAndDelete(id);
};

module.exports = {
  findAllMainCategories,
  findMainCategoryByIdWithDetails,
  findMainCategoryByName,
  createMainCategory,
  updateMainCategoryById,
  deleteSubCategoriesByMainCategoryId,
  deleteMainCategoryById,
  findSubCategoryByCategoryId,
};
