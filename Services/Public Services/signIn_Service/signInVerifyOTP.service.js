const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const secretKey = "secretkey";

const signInVerifyOtpService = async (email, otp, guestUserId) => {
  // Fetch the OTP record
  const result = await prisma.oTPVerification.findUnique({
    where: { email },
  });

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

  const user = await prisma.userRegistration.findUnique({
    where: { email },
    select: { id: true, customerType: true },
  });

  if (!user) {
    return { status: 400, data: { message: 'User not found' } };
  }

  const token = jwt.sign(
    { email, id: user.id, customerType: user.customerType },
    secretKey,
    { expiresIn: '1d' }
  );

  await prisma.oTPVerification.update({
    where: { email },
    data: {
      verified: true,
      token: token,
    },
  });

  if (user.customerType === 'customer' && guestUserId) {
    const guestCartExists = await prisma.addToCart.findFirst({
      where: { guestUserId },
    });

    if (guestCartExists) {
      await prisma.addToCart.updateMany({
        where: { guestUserId },
        data: {
          customerId: user.id,
          guestUserId: null,
        },
      });
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
};

module.exports = {
  signInVerifyOtpService,
};
