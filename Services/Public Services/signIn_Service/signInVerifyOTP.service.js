// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const jwt = require('jsonwebtoken');

// const secretKey = "secretkey";

// const signInVerifyOtpService = async (email, otp, guestUserId) => {
//   // Fetch the OTP record
//   const result = await prisma.oTPVerification.findUnique({
//     where: { email },
//   });

//   if (!result) {
//     return { status: 400, data: { message: 'OTP not found' } };
//   }

//   const { otp: storedOtp, expiredDate, verified } = result;
//   const currentTime = new Date();

//   if (currentTime > expiredDate) {
//     return { status: 400, data: { message: 'OTP expired' } };
//   }

//   if (storedOtp !== otp) {
//     return { status: 400, data: { message: 'Incorrect OTP' } };
//   }

//   if (verified) {
//     return { status: 400, data: { message: 'OTP already verified' } };
//   }

//   const user = await prisma.userRegistration.findUnique({
//     where: { email },
//     select: { id: true, customerType: true },
//   });

//   if (!user) {
//     return { status: 400, data: { message: 'User not found' } };
//   }

//   const token = jwt.sign(
//     { email, id: user.id, customerType: user.customerType },
//     secretKey,
//     { expiresIn: '1d' }
//   );

//   await prisma.oTPVerification.update({
//     where: { email },
//     data: {
//       verified: true,
//       token: token,
//     },
//   });

//   if (user.customerType === 'customer' && guestUserId) {
//     const guestCartExists = await prisma.addToCart.findFirst({
//       where: { guestUserId },
//     });

//     if (guestCartExists) {
//       await prisma.addToCart.updateMany({
//         where: { guestUserId },
//         data: {
//           customerId: user.id,
//           guestUserId: null,
//         },
//       });
//     }
//   }

//   return {
//     status: 200,
//     data: {
//       message: 'OTP verified successfully',
//       token,
//       user,
//     },
//   };
// };

// module.exports = {
//   signInVerifyOtpService,
// };
const jwt = require('jsonwebtoken');
const { OTPVerification, UserRegistration, AddToCart } = require('../../../Models/Collections'); // Adjust import path to your models

const secretKey = "secretkey";

const signInVerifyOtpService = async (email, otp, guestUserId) => {
  try {
    const result = await OTPVerification.findOne({ email });

    if (!result) {
      return { status: 400, data: { message: 'OTP not found' } };
    }

    const { otp: storedOtp, expiredDate, verified } = result;
    const currentTime = new Date();

    if (currentTime > expiredDate) {
      return { status: 400, data: { message: 'OTP expired' } };
    }

    if (storedOtp !== otp) {
      return { status: 400, data: { message: 'Incorrect OTP' } };
    }

    if (verified) {
      return { status: 400, data: { message: 'OTP already verified' } };
    }

    const user = await UserRegistration.findOne({ email }, { id: 1, customerType: 1 });

    if (!user) {
      return { status: 400, data: { message: 'User not found' } };
    }

    const token = jwt.sign(
      { email, id: user._id, customerType: user.customerType },
      secretKey,
      { expiresIn: '1d' }
    );

    await OTPVerification.updateOne(
      { email },
      { $set: { verified: true, token } }
    );

    if (user.customerType === 'customer' && guestUserId) {
      const guestCartExists = await AddToCart.findOne({ guestUserId });

      if (guestCartExists) {
        await AddToCart.updateMany(
          { guestUserId },
          {
            $set: {
              customerId: user._id,
              guestUserId: null,
            },
          }
        );
      }
    }

    return {
      status: 200,
      data: {
        message: 'OTP verified successfully',
        token,
        user,
      },
    };
  } catch (error) {
    console.error('Service Error:', error);
    return {
      status: 500,
      data: { message: 'Server error', error },
    };
  }
};

module.exports = {
  signInVerifyOtpService,
};
