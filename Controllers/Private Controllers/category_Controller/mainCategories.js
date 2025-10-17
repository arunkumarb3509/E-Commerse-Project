const service = require("../../../Services/Private Services/category_Service/mainCategories.service");

const getMainCategories = async (req, res) => {
  try {
    const categories = await service.findAllMainCategories();
    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "No main categories found", noMainCategory: true });
    }
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMainCategoryWithDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const mainCategory = await service.findMainCategoryByIdWithDetails(id);
    if (!mainCategory) {
      return res.status(404).json({ message: "Main category not found" });
    }
    res.status(200).json(mainCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
