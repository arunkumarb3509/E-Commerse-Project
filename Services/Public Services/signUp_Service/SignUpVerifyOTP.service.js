// const { PrismaClient } = require('@prisma/client');
// const jwt = require('jsonwebtoken');

// const prisma = new PrismaClient();
// const secretKey = 'secretkey';

// const signUpVerifyOTPService = async (req) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return {
//       status: 400,
//       body: { message: 'Email and OTP are required' },
//     };
//   }

//   try {
//     const otpRecord = await prisma.oTPVerification.findUnique({
//       where: { email },
//     });

//     if (!otpRecord) {
//       return {
//         status: 400,
//         body: { message: 'OTP not found' },
//       };
//     }

//     const { otp: storedOtp, expiredDate, verified } = otpRecord;
//     const currentTime = new Date();

//     if (currentTime > expiredDate) {
//       return {
//         status: 400,
//         body: { message: 'OTP expired' },
//       };
//     }

//     if (storedOtp !== otp) {
//       return {
//         status: 400,
//         body: { message: 'Incorrect OTP' },
//       };
//     }

//     if (verified) {
//       return {
//         status: 400,
//         body: { message: 'OTP already verified' },
//       };
//     }

//     // Generate JWT token
//     const token = jwt.sign({ email, verified: true }, secretKey, {
//       expiresIn: '1d',
//     });

//     // Update verification status and store token
//     await prisma.oTPVerification.update({
//       where: { email },
//       data: {
//         verified: true,
//         token,
//       },
//     });

//     return {
//       status: 200,
//       body: {
//         message: 'OTP verified successfully',
//         token,
//       },
//     };
//   } catch (error) {
//     console.error('Service Error:', error);
//     return {
//       status: 500,
//       body: { message: 'Database error', error },
//     };
//   }
// };

// module.exports = {
//   signUpVerifyOTPService,
// };

const jwt = require('jsonwebtoken');
const { OTPVerification } = require('../../../Models/Collections'); // Adjust path if needed

const secretKey = 'secretkey';

const signUpVerifyOTPService = async (req) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return {
      status: 400,
      body: { message: 'Email and OTP are required' },
    };
  }

  try {
    const otpRecord = await OTPVerification.findOne({ email });

    if (!otpRecord) {
      return {
        status: 400,
        body: { message: 'OTP not found' },
      };
    }

    const { otp: storedOtp, expiredDate, verified } = otpRecord;
    const currentTime = new Date();

    if (currentTime > expiredDate) {
      return {
        status: 400,
        body: { message: 'OTP expired' },
      };
    }

    if (storedOtp !== otp) {
      return {
        status: 400,
        body: { message: 'Incorrect OTP' },
      };
    }

    if (verified) {
      return {
        status: 400,
        body: { message: 'OTP already verified' },
      };
    }

    // Generate JWT token
    const token = jwt.sign({ email, verified: true }, secretKey, {
      expiresIn: '1d',
    });

    // Update verification status and store token
    await OTPVerification.updateOne(
      { email },
      {
        $set: {
          verified: true,
          token,
        },
      }
    );

    return {
      status: 200,
      body: {
        message: 'OTP verified successfully',
        token,
      },
    };
  } catch (error) {
    console.error('Service Error:', error);
    return {
      status: 500,
      body: { message: 'Database error', error },
    };
  }
};

module.exports = {
  signUpVerifyOTPService,
};
