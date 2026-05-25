// // const { PrismaClient } = require('@prisma/client');
// // const prisma = new PrismaClient();

// // // Fetch user details by user ID, including address
// // const getUserDetailsById = async (userId) => {
// //   return await prisma.userRegistration.findUnique({
// //     where: { id: parseInt(userId, 10) },
// //     include: {
// //       UserAddress: true,
// //     },
// //   });
// // };

// // // Safely convert BigInt to string for JSON response
// // const safeJsonStringify = (obj) => {
// //   return JSON.parse(
// //     JSON.stringify(obj, (key, value) =>
// //       typeof value === 'bigint' ? value.toString() : value
// //     )
// //   );
// // };

// // module.exports = {
// //   getUserDetailsById,
// //   safeJsonStringify,
// // };

// const ProductImage = require('../../../Models/Collections');
// const UserRegistration = require('../../../Models/Collections');



// const getUserDetailsById = async (userId) => {
//   const id = parseInt(userId, 10);
//   if (isNaN(id)) throw new Error("Invalid user ID");

//   return await UserRegistration.findUnique({
//     where: { id },
//     include: {
//       UserAddress: true,
//     },
//   });
// };

// const safeJsonStringify = (obj) => {
//   return JSON.parse(
//     JSON.stringify(obj, (_, value) =>
//       typeof value === 'bigint' ? value.toString() : value
//     )
//   );
// };
// module.exports = {
//   getUserDetailsById,
//   safeJsonStringify,
// };


// const getUserDetailsById = async (userId) => {
//   // userId in MongoDB is _id (ObjectId), so we use Mongoose ObjectId
//   const mongoose = require('mongoose');
//   // if (!mongoose.Types.ObjectId.isValid(userId)) {
//   //   throw new Error("Invalid user ID");
//   // }

//   // Fetch user and populate their addresses
//   const user = await UserRegistration.findById(userId).populate('UserAddress');

//   return user;
// };
// const getUserDetailsById = async (userId) => {
//   const id = parseInt(userId, 10);
//   if (isNaN(id)) throw new Error("Invalid user ID");

//   const user = await UserRegistration.findOne({ userId: id }).populate('UserAddress');
//   return user;
// };

const { UserRegistration } = require('../../../Models/Collections'); // adjust path
const { UserAddress } = require('../../../Models/Collections');

const getUserDetailsById = async (userId) => {
  const id = parseInt(userId, 10);
  if (isNaN(id)) throw new Error("Invalid user ID");

  // Step 1: Get user info
  const user = await UserRegistration.findOne({ userId: id });
  if (!user) return null;

  // Step 2: Get user's address(es)
  const addresses = await UserAddress.find({ userId: id });

  // Step 3: Merge address into user object
  const result = {
    ...user.toObject(),
    UserAddress: addresses,
  };

  return result;
};



const safeJsonStringify = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

const updateSellerDetailsService = async (
  userId,
  payload
) => {

  const id = parseInt(userId, 10);

  const {
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    zipCode
  } = payload;

  // UPDATE USER
  await UserRegistration.findOneAndUpdate(
    { userId: id },
    {
      $set: {
        firstName,
        lastName,
        phone
      }
    },
    { new: true }
  );

  // UPDATE ADDRESS
  await UserAddress.findOneAndUpdate(
    { userId: id },
    {
      $set: {
        address,
        city,
        state,
        zipCode
      }
    },
    { new: true }
  );

  // GET UPDATED USER
  const user = await UserRegistration.findOne({
    userId: id
  });

  const addresses = await UserAddress.find({
    userId: id
  });

  const result = {
    ...user.toObject(),
    UserAddress: addresses
  };

  return result;
};

  


module.exports = {
  getUserDetailsById,
  safeJsonStringify,
  updateSellerDetailsService
};
