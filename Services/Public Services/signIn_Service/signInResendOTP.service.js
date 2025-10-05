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

// const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// const sendOtpEmail = (email, otp, type) => {
//   const subjectMap = {
//     signup: 'Your resend OTP Code',
//     signIn: 'Your resend OTP Code',
//     'forgot password': 'Your forgot OTP Code',
//   };

//   const html = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>OTP Page</title>
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
//       overflow: hidden;
//       max-width: 400px;
//       width: 100%;
//       background-color: #ffffff;
//     }
//     .card-header {
//       font-optical-sizing: auto;
//       font-style: normal;
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
//     <div class="card-header fw-bold">OTP Page</div>
//     <div class="card-body">
//       <h4>Your Email: ${email}</h4>
//       <h4>${type} OTP Code: ${otp}</h4>
//       <p>It will expire in 5 minutes.</p>
//     </div>
//   </div>
// </body>
// </html>
// `;

//   const mailOptions = {
//     from: 'arunbusiness1433@gmail.com',
//     to: email,
//     subject: subjectMap[type] || 'Your OTP Code',
//     html: html,
//   };

//   return transporter.sendMail(mailOptions);
// };

// const resendOtp = async (email, type) => {
//   const otp = generateOTP();
//   const createdDate = new Date();
//   const expiredDate = new Date(createdDate.getTime() + 5 * 60000);

//   const existing = await prisma.oTPVerification.findUnique({ where: { email } });
//   if (existing) {
//     await prisma.oTPVerification.delete({ where: { email } });
//   }

//   await prisma.oTPVerification.create({
//     data: {
//       email,
//       otp,
//       createdDate,
//       expiredDate,
//       verified: false,
//       workflow: type,
//     },
//   });

//   await sendOtpEmail(email, otp, type);

//   return { message: 'OTP resent to email' };
// };

// module.exports = {
//   resendOtp,
// };

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { OTPVerification } = require('../../../Models/Collections'); // Adjust path as needed

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arunbusiness1433@gmail.com',
    pass: 'mwot tscs qent actm',
  },
});

// Generate 6-digit OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOtpEmail = async (email, otp, type) => {
  const subjectMap = {
    signup: 'Your resend OTP Code',
    signIn: 'Your resend OTP Code',
    'forgot password': 'Your forgot OTP Code',
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Page</title>
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
      overflow: hidden;
      max-width: 400px;
      width: 100%;
      background-color: #ffffff;
    }
    .card-header {
      font-optical-sizing: auto;
      font-style: normal;
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
    <div class="card-header fw-bold">OTP Page</div>
    <div class="card-body">
      <h4>Your Email: ${email}</h4>
      <h4>${type} OTP Code: ${otp}</h4>
      <p>It will expire in 5 minutes.</p>
    </div>
  </div>
</body>
</html>
`;

  const mailOptions = {
    from: 'arunbusiness1433@gmail.com',
    to: email,
    subject: subjectMap[type] || 'Your OTP Code',
    html: html,
  };

  return transporter.sendMail(mailOptions);
};

const resendOtp = async (email, type) => {
  const otp = generateOTP();
  const createdDate = new Date();
  const expiredDate = new Date(createdDate.getTime() + 5 * 60000); // 5 minutes

  try {
    // Remove existing OTP if it exists
    await OTPVerification.deleteOne({ email });

    // Insert new OTP record
    await OTPVerification.create({
      email,
      otp,
      createdDate,
      expiredDate,
      verified: false,
      workflow: type,
    });

    // Send email
    await sendOtpEmail(email, otp, type);

    return {
      status: 200,
      body: { message: 'OTP resent to email' },
    };
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return {
      status: 500,
      body: { message: 'Failed to resend OTP', error },
    };
  }
};

module.exports = {
  resendOtp,
};
