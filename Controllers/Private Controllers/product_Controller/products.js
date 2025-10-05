const {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  getProductByCodeService,
  updateProductService,
  getProductsByCategoryTypeService
} = require('../../../Services/Private Services/product_Service/products.service');

const createProduct = async (req, res) => {
  try {
    const result = await createProductService(req.body);
    res.status(201).json({ message: "Product added successfully", ...result });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred", ...error });
  }
};

const getAllProductDetails = async (req, res) => {
  try {
    const products = await getAllProductsService();
    if (!products.length) {
      return res.status(404).json({ message: 'No products found', noProductData: true });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: 'An error occurred while retrieving products.', noProductData: true });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found', noProductData: true });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: 'An error occurred while retrieving the product.' });
  }
};

const getProductByProductCode = async (req, res) => {
  try {
    const product = await getProductByCodeService(req.params.productCode);
    if (!product) return res.status(404).json({ message: 'Product code not found', noProductData: true });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: 'An error occurred while retrieving the product.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product ID' });

    const result = await updateProductService(productId, req.body);
    res.status(200).json({ message: "Product updated successfully", ...result });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

const getProductsByCategoryType = async (req, res) => {
  try {
    const categoryTypeId = parseInt(req.params.categoryTypeId);
    if (isNaN(categoryTypeId)) return res.status(400).json({ message: 'Invalid categoryTypeId', invalidId: true });

    const products = await getProductsByCategoryTypeService(categoryTypeId);
    if (!products.length) return res.status(404).json({ message: 'No products found for the given categoryTypeId', noProducts: true });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category type:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getAllProductDetails,
  getProductById,
  getProductByProductCode,
  updateProduct,
  getProductsByCategoryType
};
