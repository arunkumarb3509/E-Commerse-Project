const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch user details by user ID, including address
const getUserDetailsById = async (userId) => {
  return await prisma.userRegistration.findUnique({
    where: { id: parseInt(userId, 10) },
    include: {
      UserAddress: true,
    },
  });
};

// Safely convert BigInt to string for JSON response
const safeJsonStringify = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

module.exports = {
  getUserDetailsById,
  safeJsonStringify,
};
