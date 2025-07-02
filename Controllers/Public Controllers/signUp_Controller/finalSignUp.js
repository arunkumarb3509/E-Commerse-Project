const { signUpService } = require('../../../Services/Public Services/signUp_Service/finalSignUp.service');

const signUp = async (req, res) => {
  try {
    const response = await signUpService(req);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  signUp,
};
