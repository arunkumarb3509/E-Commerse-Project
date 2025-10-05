// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const cleanupExpiredOTPs = async () => {
//   try {
//     await prisma.oTPVerification.deleteMany({
//       where: {
//         expiredDate: {
//           lt: new Date(),  // Compares if expired_date is less than the current date
//         }
//       }
//     });
//     console.log('Expired OTPs cleaned up successfully');
//   } catch (error) {
//     console.error('Error cleaning up expired OTPs:', error);
//   }
// }

// module.exports = {
//   cleanupExpiredOTPs
// }

const { OTPVerification } = require('../../../Models/Collections');

const cleanupExpiredOTPs = async () => {
  try {
    const result = await OTPVerification.deleteMany({
      expiredDate: { $lt: new Date() } // Delete all OTPs where expiredDate is before now
    });
    console.log(`✅ Expired OTPs cleaned up: ${result.deletedCount}`);
  } catch (error) {
    console.error('❌ Error cleaning up expired OTPs:', error);
  }
};

module.exports = {
  cleanupExpiredOTPs
};
