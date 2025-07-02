const { signInSendOtpService } = require('../../../Services/Public Services/signIn_Service/signInSendOTP.service');

const signInSendOtp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await signInSendOtpService(email, password);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Database error', error });
  }
};

module.exports = {
  signInSendOtp,
};
