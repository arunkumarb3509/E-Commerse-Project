const multer = require('multer');


// Configure Multer storage
const storage = multer.memoryStorage(); // Use memoryStorage if saving files in the database
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});

// Allow multiple fields
const uploadMiddleware = upload.fields([
  { name: 'Image1', maxCount: 1 },
  { name: 'Image2', maxCount: 1 },
  { name: 'Image3', maxCount: 1 },
  { name: 'Image4', maxCount: 1 },
  { name: 'Image5', maxCount: 1 },
]);

module.exports = uploadMiddleware;


