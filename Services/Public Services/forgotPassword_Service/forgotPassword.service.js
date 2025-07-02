const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resetPassword = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.loginAccount.update({
    where: { email },
    data: { password: hashedPassword },
  });

  return result;
};

module.exports = {
  resetPassword,
};
