// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const getOTPDetailsService = async (req) => {
//   const { email, otp } = req.params;

//   if (!email || !otp) {
//     return {
//       status: 400,
//       body: { message: 'Email and OTP are required' },
//     };
//   }

//   try {
//     const otpDetails = await prisma.oTPVerification.findFirst({
//       where: {
//         email,
//         otp,
//       },
//     });

//     if (!otpDetails) {
//       return {
//         status: 404,
//         body: { message: 'OTP details not found' },
//       };
//     }

//     return {
//       status: 200,
//       body: otpDetails,
//     };
//   } catch (error) {
//     console.error('Service Error:', error);
//     return {
//       status: 500,
//       body: { message: 'Database error' },
//     };
//   }
// };

// module.exports = {
//   getOTPDetailsService,
// };

const { OTPVerification } = require('../../../Models/Collections'); // Adjust path as needed

const getOTPDetailsService = async (req) => {
  const { email, otp } = req.params;

  if (!email || !otp) {
    return {
      status: 400,
      body: { message: 'Email and OTP are required' },
    };
  }

  try {
    const otpDetails = await OTPVerification.findOne({ email, otp });

    if (!otpDetails) {
      return {
        status: 404,
        body: { message: 'OTP details not found' },
      };
    }

    return {
      status: 200,
      body: otpDetails,
    };
  } catch (error) {
    console.error('Service Error:', error);
    return {
      status: 500,
      body: { message: 'Database error' },
    };
  }
};

module.exports = {
  getOTPDetailsService,
};

