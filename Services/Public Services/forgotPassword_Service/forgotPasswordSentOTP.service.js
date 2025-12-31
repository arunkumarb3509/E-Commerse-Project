// const { PrismaClient } = require('@prisma/client');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// const prisma = new PrismaClient();

// const sendForgotOTP = async (email) => {
//   try {
//     // Check if email exists
//     const user = await prisma.loginAccount.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return { status: 400, data: { message: 'Email does not exist', emailExists: false } };
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'arunbusiness1433@gmail.com',
//         pass: 'mwot tscs qent actm',
//       },
//     });

//     const otp = crypto.randomInt(100000, 999999).toString();
//     const createdDate = new Date();
//     const expiredDate = new Date(createdDate.getTime() + 5 * 60000); // 5 minutes

//     // Remove existing OTP
//     const existingOTP = await prisma.oTPVerification.findUnique({
//       where: { email },
//     });

//     if (existingOTP) {
//       await prisma.oTPVerification.delete({
//         where: { email },
//       });
//     }

//     // Create new OTP
//     await prisma.oTPVerification.create({
//       data: {
//         email,
//         otp,
//         createdDate,
//         expiredDate,
//         verified: false,
//         workflow: 'forgot password',
//       },
//     });

//     // Email content
//     const mailOptions = {
//       from: 'arunbusiness1433@gmail.com',
//       to: email,
//       subject: 'Your Forgot Password OTP Code',
//       html: `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>OTP Page</title>
// <style>
//   body { background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
//   .card { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; max-width: 400px; background-color: #ffffff; }
//   .card-header { padding: 20px; background-color: #084716; color: white; text-align: center; }
//   .card-body { padding: 20px; background-color: rgb(222, 228, 195); }
//   .card-body h4, .card-body p { margin: 10px 0; }
// </style>
// </head>
// <body>
//   <div class="card">
//     <div class="card-header fw-bold">FASHION FLAIR</div>
//     <div class="card-body">
//       <h4>Your Email: ${email}</h4>
//       <h4>Forgot Password OTP Code: ${otp}</h4>
//       <p>It will expire in 5 minutes.</p>
//     </div>
//   </div>
// </body>
// </html>`,
//     };

//     return new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('SendMail Error:', error);

//           // ✅ Check for network-related error
//           if (
//             error.code === 'EDNS' ||
//             error.code === 'ENOTFOUND' ||
//             error.code === 'ECONNREFUSED' ||
//             error.code === 'EAI_AGAIN' ||
//             error.code === 'ECONNRESET'
//           ) {
//             resolve({
//               status: 503,
//               data: { message: 'Please check your internet connection' },
//             });
//           } else {
//             resolve({
//               status: 500,
//               data: { message: 'Error sending OTP email', error },
//             });
//           }
//         } else {
//           resolve({
//             status: 200,
//             data: { message: 'OTP sent to email', isOTPSendMessage: true },
//           });
//         }
//       });
//     });
//   } catch (err) {
//     console.error('Service Error:', err);
//     return {
//       status: 500,
//       data: { message: 'Internal server error', error: err },
//     };
//   }
// };

// module.exports = {
//   sendForgotOTP,
// };

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { LoginAccount, OTPVerification } = require('../../../Models/Collections'); // adjust path to your Mongoose models

const sendForgotOTP = async (email) => {
  try {
    // Check if email exists
    const user = await LoginAccount.findOne({ email });

    if (!user) {
      return { status: 400, data: { message: 'Email does not exist', emailExists: false } };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'arunbusiness1433@gmail.com',
        pass: 'ahhy inpq lvpj gqjx',
      },
    });

    const otp = crypto.randomInt(100000, 999999).toString();
    const createdDate = new Date();
    const expiredDate = new Date(createdDate.getTime() + 5 * 60000); // 5 minutes

    // Remove existing OTP
    await OTPVerification.deleteOne({ email });

    // Create new OTP
    const newOTP = new OTPVerification({
      email,
      otp,
      createdDate,
      expiredDate,
      verified: false,
      workflow: 'forgot password',
    });

    await newOTP.save();

    // Email content
    const mailOptions = {
      from: 'arunbusiness1433@gmail.com',
      to: email,
      subject: 'Your Forgot Password OTP Code',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OTP Page</title>
<style>
  body { background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
  .card { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; max-width: 400px; background-color: #ffffff; }
  .card-header { padding: 20px; background-color: #084716; color: white; text-align: center; }
  .card-body { padding: 20px; background-color: rgb(222, 228, 195); }
  .card-body h4, .card-body p { margin: 10px 0; }
</style>
</head>
<body>
  <div class="card">
    <div class="card-header fw-bold">FASHION FLAIR</div>
    <div class="card-body">
      <h4>Your Email: ${email}</h4>
      <h4>Forgot Password OTP Code: ${otp}</h4>
      <p>It will expire in 5 minutes.</p>
    </div>
  </div>
</body>
</html>`,
    };

    return new Promise((resolve) => {
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('SendMail Error:', error);

          if (
            error.code === 'EDNS' ||
            error.code === 'ENOTFOUND' ||
            error.code === 'ECONNREFUSED' ||
            error.code === 'EAI_AGAIN' ||
            error.code === 'ECONNRESET'
          ) {
            resolve({
              status: 503,
              data: { message: 'Please check your internet connection' },
            });
          } else {
            resolve({
              status: 500,
              data: { message: 'Error sending OTP email', error },
            });
          }
        } else {
          resolve({
            status: 200,
            data: { message: 'OTP sent to email', isOTPSendMessage: true },
          });
        }
      });
    });
  } catch (err) {
    console.error('Service Error:', err);
    return {
      status: 500,
      data: { message: 'Internal server error', error: err },
    };
  }
};

module.exports = {
  sendForgotOTP,
};
