const { verifyForgotOTP } = require('../../../Services/Public Services/forgotPassword_Service/forgotPasswordVerifyOTP.service');

const forgotVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await verifyForgotOTP(email, otp);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error });
  }
};

module.exports = {
  forgotVerifyOTP,
};
