const { checkEmailExistsService } = require('../../../Services/Public Services/signUp_Service/checkEmailExist.service');

const emailExists = async (req, res) => {
  const { email } = req.body;

  const result = await checkEmailExistsService(email);
  return res.status(result.status).json(result.data);
};

module.exports = {
  emailExists,
};
