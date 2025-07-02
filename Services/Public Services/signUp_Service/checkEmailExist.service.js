const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkEmailExistsService = async (email) => {
  try {
    const existingEmail = await prisma.oTPVerification.findUnique({
      where: { email },
    });

    const registeredEmail = await prisma.userRegistration.findUnique({
      where: { email },
    });

    if (existingEmail || registeredEmail) {
      return {
        status: 200,
        data: { message: 'Email already exists', emailExists: true },
      };
    } else {
      return {
        status: 200,
        data: { message: 'Email does not exist', emailExists: false },
      };
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return {
      status: 500,
      data: { error: 'Internal Server Error' },
    };
  }
};

module.exports = {
  checkEmailExistsService,
};
