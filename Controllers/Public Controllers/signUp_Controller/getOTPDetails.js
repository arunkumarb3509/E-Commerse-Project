const { getOTPDetailsService } = require('../../../Services/Public Services/signUp_Service/getOTPDetails.service');

const getOTPDetails = async (req, res) => {
  try {
    const response = await getOTPDetailsService(req);
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getOTPDetails,
};
