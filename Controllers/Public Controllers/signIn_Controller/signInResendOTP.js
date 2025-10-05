const { resendOtp } = require('../../../Services/Public Services/signIn_Service/signInResendOTP.service');

const signUpResendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    await resendOtp(email, 'signup');
    res.status(200).json({ message: 'OTP resent to email', isOTPReSendMessage: true });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP email', error });
  }
};

const signInResendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    await resendOtp(email, 'signIn');
    res.status(200).json({ message: 'OTP resent to email', isOTPSendMessage: true });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP email', error });
  }
};

const forgotPasswordResendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    await resendOtp(email, 'forgot password');
    res.status(200).json({ message: 'OTP resent to email', isOTPSendMessage: true });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP email', error });
  }
};

module.exports = {
  signUpResendOtp,
  signInResendOtp,
  forgotPasswordResendOtp,
};
