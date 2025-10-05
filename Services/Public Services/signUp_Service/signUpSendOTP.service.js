// const { PrismaClient } = require('@prisma/client');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// const prisma = new PrismaClient();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'arunbusiness1433@gmail.com',
//     pass: 'mwot tscs qent actm',
//   },
// });

// const signUpSentOTPService = async (req) => {
//   const { email } = req.body;

//   if (!email) {
//     return {
//       status: 400,
//       body: { message: 'Email is required' },
//     };
//   }

//   const otp = crypto.randomInt(100000, 999999).toString();
//   const createdDate = new Date();
//   const expiredDate = new Date(createdDate.getTime() + 5 * 60000); // 5 minutes

//   try {
//     // Check if email already exists
//     const emailExists = await prisma.oTPVerification.findUnique({
//       where: { email },
//     });

//     if (emailExists) {
//       return {
//         status: 200,
//         body: { message: 'Email already exists', emailExists: true },
//       };
//     }

//     // Insert OTP record
//     await prisma.oTPVerification.create({
//       data: {
//         email,
//         otp,
//         createdDate,
//         expiredDate,
//         verified: false,
//         workflow: 'signup',
//       },
//     });

//     const mailOptions = {
//       from: 'arunbusiness1433@gmail.com',
//       to: email,
//       subject: 'Your Signup OTP Code',
//       html: getOtpEmailTemplate(email, otp),
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     return {
//       status: 200,
//       body: { message: 'OTP sent to email', isOTPSendMessage: true },
//     };
//   } catch (error) {
//     console.error('Service Error:', error);
    
//      //  Check for network error
//     if (error.code === 'EDNS' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
//       return {
//         status: 503,
//         body: { message: 'Please check your internet connection' },
//       };
//     }
//     return {
//       status: 500,
//       body: { message: 'Error sending OTP email', error },
//     };
//   }
// };

// // Helper: Generate HTML Email Template
// const getOtpEmailTemplate = (email, otp) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>OTP</title>
//   <style>
//     body {
//       background-color: #f8f9fa;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       height: 100vh;
//       margin: 0;
//     }
//     .card {
//       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//       border-radius: 8px;
//       max-width: 400px;
//       width: 100%;
//       background-color: #fff;
//     }
//     .card-header {
//       padding: 20px;
//       background-color: #084716;
//       color: white;
//       text-align: center;
//     }
//     .card-body {
//       padding: 20px;
//       background-color: rgb(222, 228, 195);
//     }
//     .card-body h4, .card-body p {
//       margin: 10px 0;
//     }
//   </style>
// </head>
// <body>
//   <div class="card">
//     <div class="card-header fw-bold">FASHION FLAIR</div>
//     <div class="card-body">
//       <h4>Your Email: ${email}</h4>
//       <h4>Signup OTP Code: ${otp}</h4>
//       <p>It will expire in 5 minutes.</p>
//     </div>
//   </div>
// </body>
// </html>
// `;

// module.exports = {
//   signUpSentOTPService,
// };

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { OTPVerification } = require('../../../Models/Collections'); // Adjust the path as needed

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arunbusiness1433@gmail.com',
    pass: 'mwot tscs qent actm',
  },
});

const signUpSentOTPService = async (req) => {
  const { email } = req.body;

  if (!email) {
    return {
      status: 400,
      body: { message: 'Email is required' },
    };
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const createdDate = new Date();
  const expiredDate = new Date(createdDate.getTime() + 5 * 60000); // 5 minutes

  try {
    // Check if email already exists
    const emailExists = await OTPVerification.findOne({ email });

    if (emailExists) {
      return {
        status: 200,
        body: { message: 'Email already exists', emailExists: true },
      };
    }

    // Insert OTP record
    await OTPVerification.create({
      email,
      otp,
      createdDate,
      expiredDate,
      verified: false,
      workflow: 'signup',
    });

    const mailOptions = {
      from: 'arunbusiness1433@gmail.com',
      to: email,
      subject: 'Your Signup OTP Code',
      html: getOtpEmailTemplate(email, otp),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      body: { message: 'OTP sent to email', isOTPSendMessage: true },
    };
  } catch (error) {
    console.error('Service Error:', error);

    // Check for network-related errors
    if (
      error.code === 'EDNS' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED'
    ) {
      return {
        status: 503,
        body: { message: 'Please check your internet connection' },
      };
    }

    return {
      status: 500,
      body: { message: 'Error sending OTP email', error },
    };
  }
};

// Helper: Generate HTML Email Template
const getOtpEmailTemplate = (email, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP</title>
  <style>
    body {
      background-color: #f8f9fa;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      max-width: 400px;
      width: 100%;
      background-color: #fff;
    }
    .card-header {
      padding: 20px;
      background-color: #084716;
      color: white;
      text-align: center;
    }
    .card-body {
      padding: 20px;
      background-color: rgb(222, 228, 195);
    }
    .card-body h4, .card-body p {
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header fw-bold">FASHION FLAIR</div>
    <div class="card-body">
      <h4>Your Email: ${email}</h4>
      <h4>Signup OTP Code: ${otp}</h4>
      <p>It will expire in 5 minutes.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  signUpSentOTPService,
};
