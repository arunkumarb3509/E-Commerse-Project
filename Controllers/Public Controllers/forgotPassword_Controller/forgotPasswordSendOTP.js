const { sendForgotOTP } = require('../../../Services/Public Services/forgotPassword_Service/forgotPasswordSentOTP.service');

const forgotsendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await sendForgotOTP(email);

    // Handle email not found
    if (result.data?.emailExists === false) {
      return res.status(result.status).json(result.data);
    }

    // Return general response from service
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

module.exports = {
  forgotsendOTP,
};
