const { signUpVerifyOTPService } = require('../../../Services/Public Services/signUp_Service/SignUpVerifyOTP.service');

const SignUpverifyOTP = async (req, res) => {
  try {
    const response = await signUpVerifyOTPService(req);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  SignUpverifyOTP,
};
