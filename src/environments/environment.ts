// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { finalize } from "rxjs";

const URL = `http://localhost:5000/api`; // LOCAL


export const environment = {
  production: false,
  publicSecretKey:
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdWJsaWMtYXBpLWtleSIsImlhdCI6MTY4MDg4MjYxMiwiaWF0IjoxNjgwODgyNjEyLCJleHBpcmF0aW9uIjoxNjgwOTQ4OTI0fQ',

//  LOGIN URL'S

 LOGIN:{
   LOGIN_SEND_OTP:`${URL}/SignInSendOtp`,
   LOGIN_RESEND_OTP:`${URL}/signInResendOtp`,
   LOGIN_VERIFY_OTP:`${URL}/signInVerifyOTP`,
 },

//  REGISTRATION URL'S

 REGISTRATION:{
   REGISTRATION_SEND_OTP:`${URL}/signUpSentOTP`,
   REGISTRATION_RESEND_OTP:`${URL}/signUpResendOtp`,
   REGISTRATION_VERIFY_OTP:`${URL}/verifyOTP`, 
   REGISTRATION_SUCCESS:`${URL}/signup`,
   CHECK_EMAIL_EXIS:`${URL}/emailExists`,
 },

//  FORGOT PASSWORD URL'S

 FORGOT_PASSWORD:{
   FORGOT_PASSWORD_SEND_OTP:`${URL}/forgotSendOtp`,
   FORGOT_PASSWORD_RESEND_OTP:`${URL}/forgotPasswordResendOTP`,
   FORGOT_PASSWORD_VERIFY_OTP:`${URL}/forgotVerifyOTP`, 
   CREATE_NEW_PASSWORD:`${URL}/forgotPassword`,
 },

 
//ADD TO CARD URL'S

 ADDTOCART:{
   CREATE_ADD_TO_CART:`${URL}/addToCart`,
   GET_CART_ITEM_BY_CUSTOMER:`${URL}/cart/`,
   DELETE_ITEM_FROM_CART:`${URL}/removeItemFromCart/`,
   CREATE_SAVE_FOR_LATER:`${URL}/cart/saveForLater`,
   GET_CUSTOMER_SAVED_ITEMS:`${URL}/saved-items/`,
   CREATE_MOVE_TO_CART:`${URL}/cart/moveToCart`,
   DELETE_CART_FROM_SAVED_ITEM:`${URL}/removeSavedItemFromCart/`,
 },

// CATEGORIES URL'S (SELLER)

  CATEGORY:{
   CREATE_MAIN_CATEGORY:`${URL}/mainCategories`,
   CREATE_SUB_CATEGORY:`${URL}/subCategories`,
   GET_MAIN_CATEGORIES:`${URL}/getMainCategories`,
   GET_SUB_CATEGORIES:`${URL}/getSubcategories`,
   GET_MAIN_CATEGORY_BY_ID:`${URL}/getMainCategoryById/`,
   GET_SUB_CATEGORY_BY_ID:`${URL}/getSubCategoryById/`,
   GET_CATEGORY_TYPES:`${URL}/getCategoryTypes`,
   UPDATE_MAIN_CATEGORY:`${URL}/updateMainCategory/`,
   UPDATE_SUB_CATEGORY:`${URL}/updateSubCategory/`,
 },

// CUSTOMER LOGIN URL'S

  CUSTOMER_DATA:{
   GET_CUSTOMER_DETAILS:`${URL}/loggedInUserDetails/`,
   GET_ALL_PRODUCT_BY_CUSTOMER_ID:`${URL}/products/getProductByCustomer/`,
   CREATE_CUSTOMER_ORDER:`${URL}/products/submitCustomerOrder`
 },

//  SELLER LOGIN URL'S

  SELLER_DATA:{
   CREATE_BUSINESS_PROFILE:`${URL}/business-profile/`,
 },

//  PRODUCT URL'S

 PRODUCT:{
   CREATE_PRODUCT:`${URL}/product`,
   UPDATE_PRODUCT_BY_ID:`${URL}/updateProductById/`,
   GET_ALL_PRODUCT_DETAILS:`${URL}/getAllProductDetails`,
   GET_PRODUCT_BY_ID:`${URL}/getProductById/`,
   CREATE_PRODUCT_IMAGE:`${URL}/uploadProductImage`,
   GET_PRODUCT_IMAGE_BY_ID:`${URL}/getProductImageById/`,
   GET_PRODUCT_BY_CATEGORY_TYPE_ID:`${URL}/products/categoryType/`,
   CREATE_PRODUCT_OFFER:`${URL}/products/addOffers`,
   GET_PRODUCT_OFFER_BY_ID:`${URL}/products/getProductOffers/`,
   GET_PRODUCT_BY_CODE:`${URL}/productDetails/`,
   GET_ALL_PRODUCT_OFFER:`${URL}/products/getAllProductOffers`,
 },

 CHECKOUT:{
   CREATE_SESSION:`${URL}/create-session`,
   VERIFY_PAYMENT:`${URL}/verify-payment`,
   FINALIZE_COD:`${URL}/finalize-cod`,
 },
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
