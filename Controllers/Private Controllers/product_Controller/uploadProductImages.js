// const { PrismaClient } = require('@prisma/client');
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const prisma = new PrismaClient();

// const uploadProductImage = async (req, res) => {
//   try {
//     const productId = Array.isArray(req.body.productId) ? req.body.productId[0] : req.body.productId;
//     const userId = Array.isArray(req.body.userId) ? req.body.userId[0] : req.body.userId;
//     const titles = req.body;
    
    

//     if (!productId) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }

//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ message: 'No image files provided' });
//     }

//     const productDirectoryPath = path.join(__dirname, '../../../assets/Product Image', productId);

//     if (!fs.existsSync(productDirectoryPath)) {
//       fs.mkdirSync(productDirectoryPath, { recursive: true });
//     }

//     const savedImages = [];

//     for (let i = 1; i <= 5; i++) {
//       const fileKey = `Image${i}`;
//       const titleKey = `Image_Title${i}`;

//       if (req.files[fileKey]) {
//         const file = req.files[fileKey][0]; // Handle file array properly
//         const fileExtension = path.extname(file.originalname);
//         const fileName = `${uuidv4()}${fileExtension}`;
//         const filePath = path.join(productDirectoryPath, file.originalname);

//         fs.writeFileSync(filePath, file.buffer);

//         const imageUrl = `/assets/Product Image/${productId}/${file.originalname}`;
//         const imageTitle = titles[titleKey] || file.originalname;

//         const productImage = await prisma.productImage.create({
//           data: {
//             productId: parseInt(productId, 10),
//             imageName: file.originalname,
//             imageTitle,
//             images: file.buffer,
//             imageUrl,
//             createdBy: parseInt(userId, 10),
//             modifiedBy: parseInt(userId, 10),
//           },
//         });

//         savedImages.push(productImage);
//       }
//     }

//     res.status(201).json({
//       message: 'Product images uploaded and saved successfully',
//       savedImages,
//     });
//   } catch (error) {
//     console.error('Error during file upload:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// const getProductImageById = async (req, res) => {
//   try {
//     const { id: productId } = req.params;

//     if (!productId) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }

//     const productImages = await prisma.productImage.findMany({
//       where: { productId: parseInt(productId, 10) },
//     });

//     if (!productImages || productImages.length === 0) {
//       return res.status(404).json({ message: 'No images found for the given product ID', noImagesFound: true });
//     }

//     // Convert binary `images` to Base64 format
//     const productImagesWithBase64 = productImages.map((image) => ({
//       ...image,
//       images: image.images ? Buffer.from(image.images).toString('base64') : null, // Proper conversion
//     }));

//     res.status(200).json({
//       message: 'Product images retrieved successfully',
//       productImages: productImagesWithBase64,
//     });
//   } catch (error) {
//     console.error('Error retrieving product images:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// module.exports = { 
//   uploadProductImage,
//   getProductImageById
// };

const { ProductImage } = require('../../../Models/Collections');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadProductImage = async (req, res) => {
  try {
    // FIX: productId and userId may come as arrays
    const productId = Array.isArray(req.body.productId) ? req.body.productId[0] : req.body.productId;
    const userId = Array.isArray(req.body.userId) ? req.body.userId[0] : req.body.userId;

    const titles = req.body;
    

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const folderPath = path.join(__dirname, '../../../assets/Product Image', productId);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const savedImages = [];

    for (let i = 1; i <= 5; i++) {
      const fileKey = `Image${i}`;
      const titleKey = `Image_Title${i}`;

      if (req.files[fileKey]) {
        const file = req.files[fileKey][0];

        const ext = path.extname(file.originalname);
        const fileName = uuidv4() + ext;
        const filePath = path.join(folderPath, fileName);

        // Save file to server folder
        fs.writeFileSync(filePath, file.buffer);

        const imageUrl = `/assets/Product Image/${productId}/${fileName}`;
        const title = titles[titleKey] || file.originalname;

        // Save Mongo Document
        const newImage = await ProductImage.create({
          productId,
          imageName: fileName,
          imageTitle: title,
          images: file.buffer,
          imageUrl,
          createdBy: Number(userId),
          modifiedBy: Number(userId),
        });

        savedImages.push(newImage);
      }
    }

    res.status(201).json({
      message: "Product images uploaded successfully",
      savedImages,
    });

  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getProductImageById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const images = await ProductImage.find({ productId });

    if (!images || images.length === 0) {
      return res.status(404).json({
        message: "No images found for this product ID",
        noImagesFound: true,
      });
    }

    const result = images.map(img => ({
      ...img._doc,
      images: img.images ? img.images.toString("base64") : null
    }));

    res.status(200).json({
      message: "Product images retrieved successfully",
      productImages: result,
    });

  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { 
  uploadProductImage,
  getProductImageById
};
