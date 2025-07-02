const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyForgotOTP = async (email, otp) => {
  const otpRecord = await prisma.oTPVerification.findUnique({
    where: { email },
  });

  if (!otpRecord) {
    return { status: 400, message: 'OTP not found' };
  }

  const { otp: storedOtp, expired_date: expiredAt, verified } = otpRecord;
  const currentTime = new Date();

  if (currentTime > expiredAt) {
    await prisma.oTPVerification.delete({ where: { email } });
    return { status: 400, message: 'OTP expired' };
  }

  if (storedOtp !== otp) {
    return { status: 400, message: 'Incorrect OTP' };
  }

  if (verified) {
    return { status: 400, message: 'OTP already verified' };
  }

  // Optional: Update OTP record as verified
  // await prisma.oTPVerification.update({
  //   where: { email },
  //   data: { verified: true },
  // });

  return { status: 200, message: 'OTP verified successfully' };
};

module.exports = {
  verifyForgotOTP,
};
