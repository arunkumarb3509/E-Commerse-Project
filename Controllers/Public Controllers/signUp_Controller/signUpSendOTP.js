const { signUpSentOTPService } = require('../../../Services/Public Services/signUp_Service/signUpSendOTP.service');

const signUpSentOTP = async (req, res) => {
    
  try {
    const response = await signUpSentOTPService(req);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  signUpSentOTP,
};
