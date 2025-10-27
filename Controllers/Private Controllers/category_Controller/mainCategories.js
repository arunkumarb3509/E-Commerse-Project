const service = require("../../../Services/Private Services/category_Service/mainCategories.service");
const subService = require("../../../Services/Private Services/category_Service/subCategories.service");
const getMainCategories = async (req, res) => {
  try {
    const categories = await service.findAllMainCategories();
    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "No main categories found", noMainCategory: true });
    }

    // extra
     const mapped = categories.map(c => ({
      categoryId: c._id,
      categoryName: c.categoryName
    }));

     res.status(200).json(mapped);
    // res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMainCategoryWithDetails = async (req, res) => {
  const id = req.params.id;

  console.log("MainCategoryId:", id);

  try {
    // ✅ Step 1: Get Main Category
    const mainCategory = await service.findMainCategoryByIdWithDetails(id);
    if (!mainCategory) {
      return res.status(404).json({ message: "Main category not found" });
    }

    // ✅ Step 2: Get related SubCategories by categoryId
    const subCategories = await service.findSubCategoryByCategoryId(id);

    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({ message: "No subcategories found for this main category" });
    }

    // ✅ Step 3: Return structured data
    return res.status(200).json({
      categoryId: mainCategory._id,
      categoryName: mainCategory.categoryName,
      description: mainCategory.description,
      subCategories,
    });

  } catch (err) {
    console.error("Error fetching category details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getMainCategoryWithDetails = async (req, res) => {
//   const  id  = req.params.id;

//   console.log(id);
  
//   try {
//     const mainCategory = await service.findMainCategoryByIdWithDetails(id);
//     if (!mainCategory) {
//       return res.status(404).json({ message: "Main category not found" });
//     }
// let categoryId= id;
//     const subCategory = await subService.findSubCategoryById(categoryId);
//         if (!subCategory) {
//           return res.status(404).json({ message: 'Subcategory not found' });
//         }
    
//     // extra
//      // convert subCategories to the frontend-friendly shape
//     // const subCategories = (mainCategory.subCategories || []).map(sub => ({
//     //   subCategoryId: sub._id,
//     //   subCategoryName: sub.subCategoryName,
//     //   categoryType: sub.categoryType, // numeric id
//     //   categoryTypeInfo: sub.categoryTypeInfo || null
//     // }));

//      return res.json({
//       categoryId: mainCategory._id,
//       categoryName: mainCategory.categoryName,
//       subCategory
//     });
//     // res.status(200).json(mainCategory);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const mainCategories = async (req, res) => {
  const { userId, MainCategoryName, Main_Description } = req.body;
  try {
    const existingCategory = await service.findMainCategoryByName(
      MainCategoryName
    );
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Main category name already exists" });
    }

    const newCategory = await service.createMainCategory(
      userId,
      MainCategoryName,
      Main_Description
    );
    res
      .status(201)
      .json({
        message: "Main category successfully inserted",
        category: newCategory,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMainCategoryById = async (req, res) => {
  const { id } = req.params;
  const { categoryName, description } = req.body;
  try {
    const updatedCategory = await service.updateMainCategoryById(
      id,
      categoryName,
      description
    );
    res
      .status(200)
      .json({ message: "Main category updated successfully", updatedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating main category" });
  }
};

const deleteMainCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await service.deleteSubCategoriesByMainCategoryId(id);
    await service.deleteMainCategoryById(id);
    res
      .status(200)
      .json({
        message: "Main category and its subcategories successfully deleted",
        deletedSuccess: true,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getMainCategories,
  mainCategories,
  getMainCategoryWithDetails,
  updateMainCategoryById,
  deleteMainCategory,
};
