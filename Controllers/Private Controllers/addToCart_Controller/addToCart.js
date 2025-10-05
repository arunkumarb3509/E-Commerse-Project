const {
  addToCartService,
  getCartItemsByGuestUserIdService,
  removeItemFromCartService,
  saveItemForLaterService,
  moveToCartService,
  getSavedItemsService,
  removeSavedItemService,
  getCustomerCartItemsService,
} = require('../../../Services/Private Services/addToCart_Service/addToCart.service');

const addToCart = async (req, res) => {
  try {
    const { productId, guestUserId } = req.body;
    if (!productId || !guestUserId) return res.status(400).json({ message: "Product ID and Customer ID are required." });

    const result = await addToCartService(productId, guestUserId);

    if (result.exists) return res.status(200).json({ message: "Product already in cart.", itemAlreadyExist: true });
    if (result.saved) return res.status(200).json({ message: "Product already saved.", itemAlreadySaved: true });

    res.status(201).json({ message: "Product added to cart.", cart: result.cart, itemAddedSuccess: true });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error." });
  }
};

const getCartItemsByCustomer = async (req, res) => {
  try {
    const { guestUserId } = req.params;
    if (!guestUserId) return res.status(400).json({ message: "guestUserId is required." });

    const cartItems = await getCartItemsByGuestUserIdService(guestUserId);
    if (cartItems.length === 0) return res.status(404).json({ message: "No products found in the cart for this customer." });

    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await removeItemFromCartService(productId);

    if (result.count === 0) return res.status(404).json({ message: "Product not found in cart" });
    res.status(200).json({ message: "Item removed from cart successfully", itemRemovedSuccess: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveItemForLater = async (req, res) => {
  try {
    const { productId, guestUserId } = req.body;
    if (!productId || !guestUserId) return res.status(400).json({ message: "Product ID and guestUser ID are required." });

    await saveItemForLaterService(productId, guestUserId);
    res.status(200).json({ message: 'Item saved for later', savedSuccess: true });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};

const moveToCart = async (req, res) => {
  try {
    const { productId, guestUserId } = req.body;
    if (!productId || !guestUserId) return res.status(400).json({ message: "Product ID and guestUser ID are required." });

    const result = await moveToCartService(productId, guestUserId);
    if (result?.alreadyInCart) return res.status(200).json({ message: "Product already in cart.", alreadyInCart: true });

    res.status(200).json({ message: 'Moved to cart.', moveToCartSuccess: true });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error." });
  }
};

const getSavedItems = async (req, res) => {
  try {
    const { guestUserId } = req.params;
    if (!guestUserId) return res.status(400).json({ message: "Invalid guestUser ID" });

    const savedItems = await getSavedItemsService(guestUserId);
    res.status(200).json({ savedItems });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeSavedItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await removeSavedItemService(productId);

    if (result.count === 0) return res.status(404).json({ message: "Product not found in saved items" });
    res.status(200).json({ message: "Item removed from saved items successfully", itemRemovedSuccess: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const customerProduct = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) return res.status(400).json({ message: "customer ID is required." });

    const items = await getCustomerCartItemsService(customerId);
    if (items.length === 0) return res.status(404).json({ message: "No products found for this customer.", customerIdNotMatch: true });

    res.status(200).json({ getAddToCartItem: items, message: 'Successfully retrieved all products for the customer.', getAllProduct: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  addToCart,
  getCartItemsByCustomer,
  removeItemFromCart,
  saveItemForLater,
  moveToCart,
  getSavedItems,
  removeSavedItemFromCart,
  customerProduct,
};
