// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const bcrypt = require('bcrypt');

// // Configure email transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'arunbusiness1433@gmail.com',
//     pass: 'mwot tscs qent actm',
//   },
// });

// const signInSendOtpService = async (email, password) => {
//   const otp = crypto.randomInt(100000, 999999).toString();
//   const created_date = new Date();
//   const expired_date = new Date(created_date.getTime() + 5 * 60000); // 5 minutes

//   try {
//     // Check if email exists
//     const user = await prisma.loginAccount.findUnique({
//       where: { email: email },
//     });

//     if (!user) {
//       return { status: 400, data: { message: 'Invalid email', inCorrectMail: true } };
//     }

//     // Check password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return { status: 400, data: { message: 'Incorrect email or password', inCorrectMessage: true } };
//     }

//     // Remove old OTPs
//     await prisma.oTPVerification.deleteMany({
//       where: { email: email },
//     });

//     // Store new OTP
//     await prisma.oTPVerification.create({
//       data: {
//         email: email,
//         otp: otp,
//         createdDate: created_date,
//         expiredDate: expired_date,
//         verified: false,
//         workflow: 'signIn',
//       },
//     });

//     // Email content
//     const mailOptions = {
//       from: 'arunbusiness1433@gmail.com',
//       to: email,
//       subject: 'Your SignIn OTP Code',
//       html: `
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
//       max-width: 400px;
//       width: 100%;
//       background-color: #ffffff;
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
//       <h4>SignIn OTP Code: ${otp}</h4>
//       <p>It will expire in 5 minutes.</p>
//     </div>
//   </div>
// </body>
// </html>
//       `,
//     };

//     // Send OTP email
//     await transporter.sendMail(mailOptions);

//     return {
//       status: 200,
//       data: {
//         message: 'OTP sent to email',
//         isOTPSendMessage: true,
//       },
//     };
//   } catch (error) {
//     console.error('SignIn OTP Service Error:', error);

//     // Check for internet/DNS/network issues
//     if (
//       error.code === 'EDNS' ||
//       error.code === 'ENOTFOUND' ||
//       error.code === 'ECONNREFUSED' ||
//       error.code === 'EAI_AGAIN' ||
//       error.code === 'ECONNRESET'
//     ) {
//       return {
//         status: 503,
//         data: { message: 'Please check your internet connection' },
//       };
//     }

//     return {
//       status: 500,
//       data: { message: 'Something went wrong while sending OTP', error },
//     };
//   }
// };

// module.exports = {
//   signInSendOtpService,
// };

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { LoginAccount, OTPVerification } = require('../../../Models/Collections'); // Adjust the path to your Mongoose models

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arunbusiness1433@gmail.com',
    pass: 'mwot tscs qent actm',
  },
});

const signInSendOtpService = async (email, password) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const createdDate = new Date();
  const expiredDate = new Date(createdDate.getTime() + 5 * 60000); // 5 minutes

  try {
    // Check if email exists
    const user = await LoginAccount.findOne({ email });

    if (!user) {
      return {
        status: 400,
        data: { message: 'Invalid email', inCorrectMail: true },
      };
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return {
        status: 400,
        data: { message: 'Incorrect email or password', inCorrectMessage: true },
      };
    }

    // Remove existing OTPs
    await OTPVerification.deleteMany({ email });

    // Save new OTP
    await OTPVerification.create({
      email,
      otp,
      createdDate,
      expiredDate,
      verified: false,
      workflow: 'signIn',
    });

    // Email content
    const mailOptions = {
      from: 'arunbusiness1433@gmail.com',
      to: email,
      subject: 'Your SignIn OTP Code',
      html: `
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
      max-width: 400px;
      width: 100%;
      background-color: #ffffff;
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
      <h4>SignIn OTP Code: ${otp}</h4>
      <p>It will expire in 5 minutes.</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      data: {
        message: 'OTP sent to email',
        isOTPSendMessage: true,
      },
    };
  } catch (error) {
    console.error('SignIn OTP Service Error:', error);

    if (
      ['EDNS', 'ENOTFOUND', 'ECONNREFUSED', 'EAI_AGAIN', 'ECONNRESET'].includes(error.code)
    ) {
      return {
        status: 503,
        data: { message: 'Please check your internet connection' },
      };
    }

    return {
      status: 500,
      data: { message: 'Something went wrong while sending OTP', error },
    };
  }
};

module.exports = {
  signInSendOtpService,
};
