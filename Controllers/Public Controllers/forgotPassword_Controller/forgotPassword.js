const { resetPassword } = require('../../../Services/Public Services/forgotPassword_Service/forgotPassword.service');

const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await resetPassword(email, password);

    if (result) {
      res.status(200).json({ message: 'Password updated successfully', passwordUpdated: true });
    } else {
      res.status(404).send({ message: 'Email not found' });
    }
  } catch (error) {
    if (error.status) {
      res.status(error.status).send({ message: error.message });
    } else {
      console.error('Error updating password:', error);
      res.status(500).send('An error occurred while updating the password');
    }
  }
};

module.exports = {
  forgotPassword,
};

