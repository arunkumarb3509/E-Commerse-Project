const { Router } = require('express');
const multer = require('multer');

const emailController = require('../Controllers/Public Controllers/signUp_Controller/checkEmailExists');
const signUpSentOTPController = require('../Controllers/Public Controllers/signUp_Controller/signUpSendOTP');
const signUpController = require('../Controllers/Public Controllers/signUp_Controller/finalSignUp');
const SignUpverifyOtpController = require('../Controllers/Public Controllers/signUp_Controller/SignUpVerifyOTP');
const getOtpDetailsController = require('../Controllers/Public Controllers/signUp_Controller/getOTPDetails');
const tokenController = require('../Controllers/Public Controllers/signIn_Controller/verifyToken');
const SignInSendOtpController = require('../Controllers/Public Controllers/signIn_Controller/SignInSendOTP');
const signInVerifyOTPController = require('../Controllers/Public Controllers/signIn_Controller/signInVerifyOTP');
const resendOtpController = require('../Controllers/Public Controllers/signIn_Controller/signInResendOTP');
const forgotOTPController = require('../Controllers/Public Controllers/forgotPassword_Controller/forgotPasswordSendOTP');
const forgotVerifyOtpController = require('../Controllers/Public Controllers/forgotPassword_Controller/forgotPasswordVerifyOTP');
const forgotPasswordController = require('../Controllers/Public Controllers/forgotPassword_Controller/forgotPassword');
const businessProfileController = require('../Controllers/Private Controllers/businessProfile_Controller/businessProfile');
const mainCategoryController = require('../Controllers/Private Controllers/category_Controller/mainCategories');
const subCategoryController = require('../Controllers/Private Controllers/category_Controller/subCategories');
const productController = require('../Controllers/Private Controllers/product_Controller/products');
const uploadProductImageController = require('../Controllers/Private Controllers/product_Controller/uploadProductImages');
const uploadMiddleware = require('../Controllers/Private Controllers/product_Controller/uploadMiddleware');
const productOfferController = require('../Controllers/Private Controllers/product_Controller/productOffers');
const addToProductController = require('../Controllers/Private Controllers/addToCart_Controller/addToCart');
const loggedInCustomerController = require('../Controllers/Private Controllers/customerLogin_Controller/loggedCustomerProduct');
const submitCustomerOrderController = require('../Controllers/Private Controllers/customerLogin_Controller/customerOrder')

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// ========== Public Routes ==========
router.post('/emailExists', emailController.emailExists);
router.post('/signUpSentOTP', signUpSentOTPController.signUpSentOTP);
router.post('/verifyOTP', SignUpverifyOtpController.SignUpverifyOTP);
router.post('/signup', signUpController.signUp);
router.post('/SignInSendOtp', SignInSendOtpController.signInSendOtp);
router.post('/signInVerifyOTP', signInVerifyOTPController.signInVerifyOTP);
router.post('/forgotSendOtp', forgotOTPController.forgotsendOTP);
router.post('/forgotVerifyOTP', forgotVerifyOtpController.forgotVerifyOTP);
router.post('/forgotPassword', forgotPasswordController.forgotPassword);
router.get('/getOTPDetails/:email', getOtpDetailsController.getOTPDetails);
router.post('/signUpResendOtp', resendOtpController.signUpResendOtp);
router.post('/signInResendOtp', resendOtpController.signInResendOtp);
router.post('/forgotPasswordResendOTP', resendOtpController.forgotPasswordResendOtp);
router.post('/verify-otp', tokenController.verifyToken);

// ========== Private Routes ==========

// 1. Business Profile
router.post('/business-profile',tokenController.verifyToken, businessProfileController.businessProfile);
router.get('/loggedInUserDetails/:userId', loggedInCustomerController.loggedInUserDetails);
router.post('/submitCustomerOrder', submitCustomerOrderController.submitOrder);


// 2. Main Categories
router.post('/mainCategories', tokenController.verifyToken, mainCategoryController.mainCategories);
router.get('/getMainCategories', mainCategoryController.getMainCategories);
router.get('/getMainCategoryById/:id', mainCategoryController.getMainCategoryWithDetails);
router.put('/updateMainCategory/:id', tokenController.verifyToken, mainCategoryController.updateMainCategoryById);
router.delete('/deleteMainCategory/:id', mainCategoryController.deleteMainCategory);

// 3. Sub Categories
router.post('/subCategories', tokenController.verifyToken, upload.single('Image'), subCategoryController.subCategories);
router.get('/getSubcategories', subCategoryController.getSubcategories);
router.get('/getSubCategoryById/:id', subCategoryController.getSubcategoriesById);
router.put('/updateSubCategory/:id', tokenController.verifyToken, subCategoryController.updateSubCategoryById);
router.get('/getCategoryTypes', subCategoryController.getCategoryTypes);

// 4. Products
router.post('/product', tokenController.verifyToken, productController.createProduct);
router.post('/uploadProductImage', tokenController.verifyToken, uploadMiddleware, uploadProductImageController.uploadProductImage);
router.get('/getAllProductDetails', productController.getAllProductDetails);
router.get('/getProductById/:id', productController.getProductById);
router.get('/productDetails/:productCode', productController.getProductByProductCode);
router.get('/getProductImageById/:id', uploadProductImageController.getProductImageById);
router.put('/updateProductById/:id', tokenController.verifyToken, productController.updateProduct);
router.get('/products/categoryType/:categoryTypeId', productController.getProductsByCategoryType);
router.post('/products/addOffers', tokenController.verifyToken, productOfferController.createProductOffer);
router.get('/products/getProductOffers/:productId', productOfferController.getProductOfferByProductId);

// 5. Add to Cart
router.post('/addToCart', addToProductController.addToCart);
router.get('/cart/:guestUserId', addToProductController.getCartItemsByCustomer);
router.delete('/removeItemFromCart/:productId', addToProductController.removeItemFromCart);
router.post('/cart/saveForLater', addToProductController.saveItemForLater);
router.get('/saved-items/:guestUserId', addToProductController.getSavedItems);
router.post('/cart/moveToCart', addToProductController.moveToCart);
router.delete('/removeSavedItemFromCart/:productId', addToProductController.removeSavedItemFromCart);
router.get('/products/getProductByCustomer/:customerId', addToProductController.customerProduct);

module.exports = router;




