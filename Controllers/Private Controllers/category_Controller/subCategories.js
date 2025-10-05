const service = require('../../../Services/Private Services/category_Service/subCategories.service');

const subCategories = async (req, res) => {
  try {
    const { MainCategoryId, SubCategoryName, CategoryTypeId, Sub_Description } = req.body;
    const Image = req.file;

    if (!MainCategoryId || !SubCategoryName || !CategoryTypeId) {
      return res.status(400).json({ message: 'Main Category ID, Sub Category Name, and Category Type ID are required' });
    }

    const mainCategory = await service.validateMainCategory(MainCategoryId);
    if (!mainCategory) {
      return res.status(404).json({ message: 'Main Category not found' });
    }

    const categoryTypeExists = await service.validateCategoryType(CategoryTypeId);
    if (!categoryTypeExists) {
      return res.status(404).json({ message: 'Category Type not found' });
    }

    let imageBuffer = null;
    if (Image) {
      const result = service.saveImageToFileSystem(Image);
      imageBuffer = result.imageBuffer;
    }

    const newSubCategory = await service.createSubCategory({
      subCategoryName: SubCategoryName,
      description: Sub_Description || null,
      images: imageBuffer,
      categoryId: mainCategory.categoryId,
      categoryTypeId: parseInt(CategoryTypeId, 10),
    });

    res.status(201).json({
      message: 'SubCategory created successfully',
      subCategory: newSubCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateSubCategoryById = async (req, res) => {
  const { id } = req.params;
  const { name, description, mainCategoryId } = req.body;

  try {
    const parsedId = parseInt(id, 10);
    const parsedMainCategoryId = parseInt(mainCategoryId, 10);

    if (isNaN(parsedId) || isNaN(parsedMainCategoryId)) {
      return res.status(400).json({ error: 'ID and Main Category ID must be valid numbers' });
    }

    const updatedSubCategory = await service.updateSubCategory(parsedId, {
      subCategoryName: name || undefined,
      description: description || undefined,
      categoryId: parsedMainCategoryId,
    });

    res.status(200).json({
      message: 'Subcategory updated successfully',
      updatedSubCategory,
    });
  } catch (err) {
    console.error('Error updating subcategory:', err);
    res.status(500).json({ error: 'Error updating subcategory' });
  }
};

const getSubcategories = async (req, res) => {
  try {
    const subCategories = await service.findAllSubCategories();

    if (subCategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found', noSubCategory: true });
    }

    const subCategoriesWithBase64Images = subCategories.map((s) => ({
      ...s,
      images: s.images ? s.images.toString('base64') : null,
    }));

    res.status(200).json(subCategoriesWithBase64Images);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubcategoriesById = async (req, res) => {
  const { id } = req.params;
  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    const subCategory = await service.findSubCategoryById(parsedId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json(subCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategoryTypes = async (req, res) => {
  try {
    const categoryTypes = await service.findAllCategoryTypes();
    if (categoryTypes.length === 0) {
      return res.status(404).json({ message: 'No category types found', noCategoryType: true });
    }

    res.status(200).json(categoryTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  subCategories,
  getSubcategoriesById,
  getSubcategories,
  updateSubCategoryById,
  getCategoryTypes,
};
