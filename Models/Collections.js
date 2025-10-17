// const mongoose = require('mongoose');

// const { Schema } = mongoose;

// // OTP Verification
// const OTPVerificationSchema = new Schema({
//   email: { type: String, unique: true },
//   otp: String,
//   createdDate: { type: Date, default: Date.now },
//   expiredDate: Date,
//   verified: { type: Boolean, default: false },
//   workflow: { type: String, default: 'initial' },
//   token: String
// }, { collection: 'otp_verification' });

// // Login Account
// const LoginAccountSchema = new Schema({
//   email: { type: String, unique: true },
//   password: String,
//   active: { type: Boolean, default: true },
//   createdDate: { type: Date, default: Date.now },
//   expiredDate: Date
// }, { collection: 'login_account' });

// // User Registration
// const UserRegistrationSchema = new Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, unique: true },
//   phone: Schema.Types.BigInt,
//   customerType: String
// }, { collection: 'user_registration' });

// // User Address
// const UserAddressSchema = new Schema({
//   address: String,
//   state: String,
//   city: String,
//   zipCode: String,
//   userId: { type: Schema.Types.ObjectId, ref: 'UserRegistration' }
// }, { collection: 'user_address' });

// // Role
// const RoleSchema = new Schema({
//   role_name: { type: String, unique: true },
//   description: String,
//   role_type: String
// }, { collection: 'role' });

// // User Role
// const UserRoleSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'UserRegistration', required: true },
//   roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true } // ✅ FIXED
// }, { collection: 'user_roles' });

// // Business Profile
// const BusinessProfileSchema = new Schema({
//   companyName: String,
//   companyOwnerName: String,
//   email: { type: String, unique: true },
//   whatsappNumber: String,
//   websiteUrl: String,
//   streetAddress: String,
//   city: String,
//   country: String,
//   state: String,
//   zipcode: String,
//   phone: String
// }, { collection: 'BusinessProfile' });

// // Main Category
// const MainCategorySchema = new Schema({
//   categoryName: { type: String, unique: true },
//   description: String,
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, { collection: 'main_categories' });

// // Sub Category
// const SubCategorySchema = new Schema({
//   categoryId: { type: Schema.Types.ObjectId, ref: 'MainCategory' },
//   categoryTypeId: { type: Schema.Types.ObjectId, ref: 'CategoryType' },
//   subCategoryName: String,
//   description: String,
//   images: Buffer,
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, { collection: 'subcategories' });

// // Category Type
// const CategoryTypeSchema = new Schema({
//   typeName: String
// }, { collection: 'category_types' });

// // Product
// const ProductSchema = new Schema({
//   categoryId: { type: Schema.Types.ObjectId, ref: 'MainCategory' },
//   subcategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
//   categoryTypeId: { type: Schema.Types.ObjectId, ref: 'CategoryType' },
//   materialType: String,
//   productCode: { type: String, unique: true },
//   productName: String,
//   brand: String,
//   price: Number,
//   totalStock: Number,
//   stockQuantity: Number,
//   reorderLevel: Number,
//   availability: String,
//   productDescription: String,
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   createdBy: Number,
//   modifiedBy: Number
// }, { collection: 'products' });

// // SEO Information
// const SEOInformationSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product', unique: true },
//   metaTitle: String,
//   metaDescription: String,
//   keywords: String,
//   careInstructions: String,
//   returnPolicy: String,
//   createdDate: { type: Date, default: Date.now },
//   modifiedDate: { type: Date, default: Date.now }
// }, { collection: 'seo_information' });

// // Shipping Information
// const ShippingInformationSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product', unique: true },
//   weight: Schema.Types.Decimal128,
//   dimensions: String,
//   shippingClass: String,
//   createdDate: { type: Date, default: Date.now },
//   modifiedDate: { type: Date, default: Date.now }
// }, { collection: 'shipping_information' });

// // Product Size
// const ProductSizeSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//   sizeId: String,
//   totalQuantity: Number,
//   stockQuantity: Number
// }, { collection: 'product_size' });

// // Product Image
// const ProductImageSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//   images: Buffer,
//   imageName: String,
//   imageTitle: String,
//   imageUrl: String,
//   createdDate: { type: Date, default: Date.now },
//   modifiedDate: { type: Date, default: Date.now },
//   createdBy: Number,
//   modifiedBy: Number
// }, { collection: 'product_image' });

// // Product Offer
// const ProductOfferSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//   offerName: String,
//   description: String,
//   discountPercentage: Number,
//   discountPrice: Number,
//   startDate: Date,
//   endDate: Date,
//   expiredDate: { type: Date, default: Date.now },
//   createdDate: { type: Date, default: Date.now },
//   modifiedDate: { type: Date, default: Date.now },
//   createdBy: String,
//   modifiedBy: String
// }, { collection: 'product_offers' });

// // Add to Cart
// const AddToCartSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//   customerId: { type: Schema.Types.ObjectId, ref: 'UserRegistration' },
//   guestUserId: String,
//   createdDate: { type: Date, default: Date.now },
//   modifiedDate: { type: Date, default: Date.now },
//   createdAt: String,
//   modifiedAt: String
// }, { collection: 'add_to_cart' });

// // Customer Saved Order
// const CustomerSavedOrderSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//   guestUserId: String,
//   createdDate: { type: Date, default: Date.now }
// }, { collection: 'customer_saved_order' });

// // Customer Address
// const CustomerAddressSchema = new Schema({
//   customerId: { type: Schema.Types.ObjectId, ref: 'UserRegistration' },
//   address: String,
//   city: String,
//   state: String,
//   zipCode: String,
//   phone: String,
//   paymentMethod: String,
//   createdAt: { type: Date, default: Date.now }
// }, { collection: 'customer_address' });

// // Order
// const OrderSchema = new Schema({
//   customerId: { type: Schema.Types.ObjectId, ref: 'UserRegistration' },
//   addressId: { type: Schema.Types.ObjectId, ref: 'CustomerAddress' },
//   totalAmount: Number,
//   createdAt: { type: Date, default: Date.now }
// }, { collection: 'Order' });

// // Order Item
// const OrderItemSchema = new Schema({
//   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
//   productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//   quantity: Number,
//   price: Number,
//   discountPrice: Number
// }, { collection: 'order_item' });

// // Export all models
// module.exports = {
//   OTPVerification: mongoose.model('OTPVerification', OTPVerificationSchema),
//   LoginAccount: mongoose.model('LoginAccount', LoginAccountSchema),
//   UserRegistration: mongoose.model('UserRegistration', UserRegistrationSchema),
//   UserAddress: mongoose.model('UserAddress', UserAddressSchema),
//   Role: mongoose.model('Role', RoleSchema),
//   UserRole: mongoose.model('UserRole', UserRoleSchema),
//   BusinessProfile: mongoose.model('BusinessProfile', BusinessProfileSchema),
//   MainCategory: mongoose.model('MainCategory', MainCategorySchema),
//   SubCategory: mongoose.model('SubCategory', SubCategorySchema),
//   CategoryType: mongoose.model('CategoryType', CategoryTypeSchema),
//   Product: mongoose.model('Product', ProductSchema),
//   SEOInformation: mongoose.model('SEOInformation', SEOInformationSchema),
//   ShippingInformation: mongoose.model('ShippingInformation', ShippingInformationSchema),
//   ProductSize: mongoose.model('ProductSize', ProductSizeSchema),
//   ProductImage: mongoose.model('ProductImage', ProductImageSchema),
//   ProductOffer: mongoose.model('ProductOffer', ProductOfferSchema),
//   AddToCart: mongoose.model('AddToCart', AddToCartSchema),
//   CustomerSavedOrder: mongoose.model('CustomerSavedOrder', CustomerSavedOrderSchema),
//   CustomerAddress: mongoose.model('CustomerAddress', CustomerAddressSchema),
//   Order: mongoose.model('Order', OrderSchema),
//   OrderItem: mongoose.model('OrderItem', OrderItemSchema),
// };

const mongoose = require('mongoose');
const { Schema } = mongoose;

/* ------------------------------------------------
   AUTO-INCREMENT SETUP FOR userId
------------------------------------------------ */
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
});

const Counter = mongoose.model('Counter', CounterSchema);

/* ------------------------------------------------
   OTP Verification
------------------------------------------------ */
const OTPVerificationSchema = new Schema({
  email: { type: String, unique: true },
  otp: String,
  createdDate: { type: Date, default: Date.now },
  expiredDate: Date,
  verified: { type: Boolean, default: false },
  workflow: { type: String, default: 'initial' },
  token: String
}, { collection: 'otp_verification' });

/* ------------------------------------------------
   Login Account
------------------------------------------------ */
const LoginAccountSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  active: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
  expiredDate: Date
}, { collection: 'login_account' });

/* ------------------------------------------------
   User Registration (with auto-increment userId)
------------------------------------------------ */
const UserRegistrationSchema = new Schema({
  userId: { type: Number, unique: true }, // auto-increment field
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: Schema.Types.BigInt,
  customerType: String,
  UserAddress: [{ type: Schema.Types.ObjectId, ref: 'UserAddress' }]
}, { collection: 'user_registration' });

// Auto-increment middleware
UserRegistrationSchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.userId = counter.seq;
  }
  next();
});

/* ------------------------------------------------
   User Address
------------------------------------------------ */
const UserAddressSchema = new Schema({
  address: String,
  state: String,
  city: String,
  zipCode: String,
  userId: { type: Number, ref: 'UserRegistration' }  // numeric reference
}, { collection: 'user_address' });

/* ------------------------------------------------
   Role
------------------------------------------------ */
const RoleSchema = new Schema({
  role_name: { type: String, unique: true },
  description: String,
  role_type: String
}, { collection: 'role' });

/* ------------------------------------------------
   User Role
------------------------------------------------ */
const UserRoleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'UserRegistration' ,required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
}, { collection: 'user_roles' });

/* ------------------------------------------------
   Business Profile
------------------------------------------------ */
const BusinessProfileSchema = new Schema({
  companyName: String,
  companyOwnerName: String,
  email: { type: String, unique: true },
  whatsappNumber: String,
  websiteUrl: String,
  streetAddress: String,
  city: String,
  country: String,
  state: String,
  zipcode: String,
  phone: String,
  userId: { type: Number, ref: 'UserRegistration' }
}, { collection: 'BusinessProfile' });

/* ------------------------------------------------
   Main Category
------------------------------------------------ */
const MainCategorySchema = new Schema({
  categoryName: { type: String, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Number, ref: 'UserRegistration' },
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }]
}, { collection: 'main_categories' });

/* ------------------------------------------------
   Sub Category
------------------------------------------------ */
const SubCategorySchema = new Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: 'MainCategory' },
  // categoryType: { type: Number, ref: 'CategoryType' },
  categoryType: Number,
  subCategoryName: String,
  description: String,
  images: Buffer,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Number, ref: 'UserRegistration' }
}, { collection: 'subcategories' });

// ✅ Virtual populate to join numeric field
SubCategorySchema.virtual('categoryTypeInfo', {
  ref: 'CategoryType',
  localField: 'categoryType',     // field in SubCategory
  foreignField: 'categoryTypeId', // field in CategoryType
  justOne: true
});
// Ensure virtuals are included when converting to JSON
SubCategorySchema.set('toObject', { virtuals: true });
SubCategorySchema.set('toJSON', { virtuals: true });
/* ------------------------------------------------
   Category Type
------------------------------------------------ */
// const CategoryTypeSchema = new Schema({
//   typeName: String
// }, { collection: 'category_types' });
const CategoryTypeSchema = new Schema({
  categoryTypeId: { type: Number, unique: true },
  typeName: String
}, { collection: 'category_types' });


/* ------------------------------------------------
   Product
------------------------------------------------ */
const ProductSchema = new Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: 'MainCategory' },
  subcategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  categoryTypeId: { type: Schema.Types.ObjectId, ref: 'CategoryType' },
  materialType: String,
  productCode: { type: String, unique: true },
  productName: String,
  brand: String,
  price: Number,
  totalStock: Number,
  stockQuantity: Number,
  reorderLevel: Number,
  availability: String,
  productDescription: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Number, ref: 'UserRegistration' },
  modifiedBy: { type: Number, ref: 'UserRegistration' }
}, { collection: 'products' });

/* ------------------------------------------------
   SEO Information
------------------------------------------------ */
const SEOInformationSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', unique: true },
  metaTitle: String,
  metaDescription: String,
  keywords: String,
  careInstructions: String,
  returnPolicy: String,
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  userId: { type: Number, ref: 'UserRegistration' }
}, { collection: 'seo_information' });

/* ------------------------------------------------
   Shipping Information
------------------------------------------------ */
const ShippingInformationSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', unique: true },
  weight: Schema.Types.Decimal128,
  dimensions: String,
  shippingClass: String,
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  userId: { type: Number, ref: 'UserRegistration' }
}, { collection: 'shipping_information' });

/* ------------------------------------------------
   Product Size
------------------------------------------------ */
const ProductSizeSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  sizeId: String,
  totalQuantity: Number,
  stockQuantity: Number
}, { collection: 'product_size' });

/* ------------------------------------------------
   Product Image
------------------------------------------------ */
const ProductImageSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  images: Buffer,
  imageName: String,
  imageTitle: String,
  imageUrl: String,
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  createdBy: { type: Number, ref: 'UserRegistration' },
  modifiedBy: { type: Number, ref: 'UserRegistration' }
}, { collection: 'product_image' });

/* ------------------------------------------------
   Product Offer
------------------------------------------------ */
const ProductOfferSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  offerName: String,
  description: String,
  discountPercentage: Number,
  discountPrice: Number,
  startDate: Date,
  endDate: Date,
  expiredDate: { type: Date, default: Date.now },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  createdBy: { type: Number, ref: 'UserRegistration' },
  modifiedBy: { type: Number, ref: 'UserRegistration' }
}, { collection: 'product_offers' });

/* ------------------------------------------------
   Add to Cart
------------------------------------------------ */
const AddToCartSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  customerId: { type: Number, ref: 'UserRegistration' },
  guestUserId: String,
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now }
}, { collection: 'add_to_cart' });

/* ------------------------------------------------
   Customer Saved Order
------------------------------------------------ */
const CustomerSavedOrderSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  guestUserId: String,
  createdDate: { type: Date, default: Date.now }
}, { collection: 'customer_saved_order' });

/* ------------------------------------------------
   Customer Address
------------------------------------------------ */
const CustomerAddressSchema = new Schema({
  customerId: { type: Number, ref: 'UserRegistration' },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  phone: String,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'customer_address' });

/* ------------------------------------------------
   Order
------------------------------------------------ */
const OrderSchema = new Schema({
  customerId: { type: Number, ref: 'UserRegistration' },
  addressId: { type: Schema.Types.ObjectId, ref: 'CustomerAddress' },
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'Order' });

/* ------------------------------------------------
   Order Item
------------------------------------------------ */
const OrderItemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
  discountPrice: Number
}, { collection: 'order_item' });

/* ------------------------------------------------
   EXPORT MODELS
------------------------------------------------ */
module.exports = {
  Counter,
  OTPVerification: mongoose.model('OTPVerification', OTPVerificationSchema),
  LoginAccount: mongoose.model('LoginAccount', LoginAccountSchema),
  UserRegistration: mongoose.model('UserRegistration', UserRegistrationSchema),
  UserAddress: mongoose.model('UserAddress', UserAddressSchema),
  Role: mongoose.model('Role', RoleSchema),
  UserRole: mongoose.model('UserRole', UserRoleSchema),
  BusinessProfile: mongoose.model('BusinessProfile', BusinessProfileSchema),
  MainCategory: mongoose.model('MainCategory', MainCategorySchema),
  SubCategory: mongoose.model('SubCategory', SubCategorySchema),
  CategoryType: mongoose.model('CategoryType', CategoryTypeSchema),
  Product: mongoose.model('Product', ProductSchema),
  SEOInformation: mongoose.model('SEOInformation', SEOInformationSchema),
  ShippingInformation: mongoose.model('ShippingInformation', ShippingInformationSchema),
  ProductSize: mongoose.model('ProductSize', ProductSizeSchema),
  ProductImage: mongoose.model('ProductImage', ProductImageSchema),
  ProductOffer: mongoose.model('ProductOffer', ProductOfferSchema),
  AddToCart: mongoose.model('AddToCart', AddToCartSchema),
  CustomerSavedOrder: mongoose.model('CustomerSavedOrder', CustomerSavedOrderSchema),
  CustomerAddress: mongoose.model('CustomerAddress', CustomerAddressSchema),
  Order: mongoose.model('Order', OrderSchema),
  OrderItem: mongoose.model('OrderItem', OrderItemSchema),
};
