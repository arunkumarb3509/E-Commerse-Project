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

const { UserRegistration, UserAddress } = require('../../../Models/Collections'); // adjust path

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
const getUserDetailsById = async (userId) => {
  const id = parseInt(userId, 10);
  if (isNaN(id)) throw new Error("Invalid user ID");

  const user = await UserRegistration.findOne({ userId: id }).populate('UserAddress');
  return user;
};


const safeJsonStringify = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

module.exports = {
  getUserDetailsById,
  safeJsonStringify,
};
