// const bcrypt = require('bcrypt');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const resetPassword = async (email, password) => {
//   if (!email || !password) {
//     throw { status: 400, message: 'Email and password are required' };
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const result = await prisma.loginAccount.update({
//     where: { email },
//     data: { password: hashedPassword },
//   });

//   return result;
// };

// module.exports = {
//   resetPassword,
// };

const bcrypt = require('bcrypt');
const { LoginAccount } = require('../../../Models/Collections'); // Adjust the path to your model file

const resetPassword = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await LoginAccount.findOneAndUpdate(
    { email },
    { $set: { password: hashedPassword } },
    { new: true }
  );

  if (!result) {
    throw { status: 404, message: 'User not found' };
  }

  return result;
};

module.exports = {
  resetPassword,
};
