const { signInVerifyOtpService } = require('../../../Services/Public Services/signIn_Service/signInVerifyOTP.service');

const jwt = require('jsonwebtoken');
const secretKey = "secretkey";

const signInVerifyOTP = async (req, res) => {
  const { email, otp, guestUserId } = req.body;

  try {
    const result = await signInVerifyOtpService(email, otp, guestUserId);
    if (result.status === 200 && result.data.user) {
      const user = result.data.user;

      // ✅ Create JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        secretKey,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: "OTP verified successfully",
        token,
        user
      });
    } else {
      return res.status(result.status).json(result.data);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Database error', error });
  }
};

module.exports = { signInVerifyOTP };
