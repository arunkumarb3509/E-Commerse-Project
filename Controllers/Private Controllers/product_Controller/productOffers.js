const service = require("../../../Services/Private Services/product_Service/productOffers.service");

const createProductOffer = async (req, res) => {
  try {
    const {
      product_id,
      offer_name,
      description,
      discount_percentage,
      discount_price,
      start_date,
      end_date,
      created_by,
      modified_by,
    } = req.body;

    // if (
    //   !product_id ||
    //   !offer_name || offer_name.trim() === "" ||
    //   !description || description.trim() === "" ||
    //   !start_date ||
    //   !end_date
    // ) {
    //   return res.status(400).json({ message: "Required fields are missing or invalid." });
    // }

    const today = new Date();

    // 1. Delete expired offers for this specific product
    await service.deleteExpiredOffers(product_id, today);

    // 2. Check if an active offer already exists
    const existingOffer = await service.checkExistingActiveOffer(
      product_id,
      today,
    );
    if (existingOffer) {
      return res.status(400).json({
        message: "A product offer already exists for this product.",
        errorType: "productExists",
      });
    }

    // 3. Create a new offer
    const newOffer = await service.createNewOffer({
      productId: product_id,
      offerName: offer_name,
      description,
      discountPercentage: discount_percentage,
      discountPrice: discount_price,
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      createdBy: created_by,
      modifiedBy: modified_by,
    });

    res.status(201).json({
      message: "Product offer created successfully.",
      addProductOffers: newOffer,
    });
  } catch (error) {
    console.error("Error creating product offer:", error);
    res.status(500).json({
      message: "Failed to create product offer.",
      errorType: "serverError",
      error,
    });
  }
};

const getProductOfferByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const today = new Date();

    // 🔥 Step 1: Automatically delete expired offers
    await service.deleteExpiredOffers(productId, today);

    // 🔥 Step 2: Get latest active offer
    const productOffer = await service.checkExistingActiveOffer(
      productId,
      today,
    );

    if (!productOffer) {
      return res.status(404).json({ message: "No offer for this product." });
    }

    today.setHours(0, 0, 0, 0);

    const end = new Date(productOffer.endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = "";

    if (diffDays > 0) {
      status = `Expires in ${diffDays} day(s)`;
    } else if (diffDays === 0) {
      status = "Expires today";
    } else {
      status = `Expired ${Math.abs(diffDays)} day(s) ago`;
    }

    res.status(200).json({
      message: "Product offer retrieved successfully.",
      productOffer,
      status,
    });
  } catch (error) {
    console.error("Error fetching product offer:", error);
    res.status(500).json({
      message: "Failed to retrieve product offer. Please try again.",
      error,
    });
  }
};

module.exports = {
  createProductOffer,
  getProductOfferByProductId,
};
