const service = require('../../../Services/Private Services/customerLogin_Service/loggedCustomer.service');

const loggedInUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const loggedUserDetails = await service.getUserDetailsById(userId);

    if (!loggedUserDetails) {
      return res.status(404).json({ message: 'loggedUserId not found' });
    }

    const safeData = service.safeJsonStringify(loggedUserDetails);

    res.status(200).json({
      message: 'loggedUser Details Successfully',
      loggedUserDetails: safeData,
    });

  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  loggedInUserDetails,
};
