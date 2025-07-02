const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const businessProfile = async (req, res) => {
  const {
    companyName, companyOwnerName, email, whatsappnumber, websiteUrl,
    streetAddress, city, country, state, zipcode, phone
  } = req.body;

  // console.log(req.body);

  try {
    // Insert into business_profile table
    const businessProfileResult = await prisma.businessProfile.create({
      data: {
        companyName,
        companyOwnerName,
        email,
        whatsappNumber: whatsappnumber,
        websiteUrl,
        streetAddress,
        city,
        country,
        state,
        zipcode,
        phone
      }
    });

    res.status(201).json({ message: 'User registered successfully' , createdBusinesssProfile:true});
    console.log(businessProfileResult);
    

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

module.exports = {
  businessProfile
};
