// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');
// const prisma = new PrismaClient();

// const signUpService = async (req) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     phone,
//     password,
//     customer_type,
//     address,
//     state,
//     city,
//     zip_code,
//   } = req.body;

//   const headerToken = req.headers["authorization"];
//   if (!headerToken) {
//     return {
//       status: 400,
//       body: { message: "Authorization token missing" }
//     };
//   }

//   const token = headerToken.split(" ")[1];

//   try {
//     // Validate OTP
//     const tokenCheck = await prisma.oTPVerification.findFirst({
//       where: { email, token },
//     });

//     if (!tokenCheck) {
//       return {
//         status: 401,
//         body: { message: "Invalid email or token" },
//       };
//     }

//     // Optional: Uncomment to enforce verified emails
//     // if (!tokenCheck.verified) {
//     //   return {
//     //     status: 400,
//     //     body: { message: "Email not verified" },
//     //   };
//     // }

//     // Check if user already exists
//     const existingUser = await prisma.userRegistration.findFirst({ where: { email } });

//     if (existingUser) {
//       return {
//         status: 200,
//         body: {
//           message: "Email already exists",
//           afterEmailExists: true,
//         },
//       };
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const createdDate = new Date();
//     const expiredDate = new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 60); // 60 days

//     // Create user
//     const newUser = await prisma.userRegistration.create({
//       data: {
//         firstName,
//         lastName,
//         email,
//         phone,
//         customerType: customer_type,
//       },
//     });

//     // Add seller address if applicable
//     if (customer_type === "seller") {
//       await prisma.userAddress.create({
//         data: {
//           address,
//           state,
//           city,
//           zipCode: zip_code,
//           userId: newUser.id,
//         },
//       });
//     }

//     // Assign role
//     const roleId = customer_type === "customer" ? 1 : 2;
//     await prisma.userRole.create({
//       data: {
//         userId: newUser.id,
//         roleId,
//       },
//     });

//     // Create login account
//     await prisma.loginAccount.create({
//       data: {
//         email,
//         password: hashedPassword,
//         active: true,
//         createdDate,
//         expiredDate,
//       },
//     });

//     return {
//       status: 201,
//       body: { message: "User registered successfully" },
//     };
//   } catch (error) {
//     console.error("Service Error:", error);
//     return {
//       status: 500,
//       body: { message: "Error registering user" },
//     };
//   }
// };

// module.exports = {
//   signUpService,
// };


const bcrypt = require('bcrypt');
const {
  OTPVerification,
  UserRegistration,
  UserAddress,
  UserRole,
  LoginAccount,Role
} = require('../../../Models/Collections'); // Adjust the path based on your project structure

const signUpService = async (req) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    customer_type,
    address,
    state,
    city,
    zip_code,
  } = req.body;

  const headerToken = req.headers["authorization"];

  if (!headerToken) {
    return {
      status: 400,
      body: { message: "Authorization token missing" }
    };
  }

  const token = headerToken.split(" ")[1];

  try {
    // Validate OTP token
    const tokenCheck = await OTPVerification.findOne({ email, token });

    if (!tokenCheck) {
      return {
        status: 401,
        body: { message: "Invalid email or token" },
      };
    }

    // Optional: Enforce only verified emails
    // if (!tokenCheck.verified) {
    //   return {
    //     status: 400,
    //     body: { message: "Email not verified" },
    //   };
    // }

    // Check if user already exists
    const existingUser = await UserRegistration.findOne({ email });
    if (existingUser) {
      return {
        status: 200,
        body: {
          message: "Email already exists",
          afterEmailExists: true,
        },
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdDate = new Date();
    const expiredDate = new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 60); // 60 days

    // Create user
    const newUser = await UserRegistration.create({
      firstName,
      lastName,
      email,
      phone,
      customerType: customer_type,
    });

    // Add address for seller
    if (customer_type === "seller") {
      await UserAddress.create({
        address,
        state,
        city,
        zipCode: zip_code,
        userId: newUser.userId,
      });
    }

    // Assign role (1 for customer, 2 for seller)
    // const roleId = customer_type === "customer" ? 1 : 2;
    // await UserRole.create({
    //   userId: newUser._id,
    //   roleId,
    // });
    // Find the role document from the Role collection
const roleDoc = await Role.findOne({ role_type: customer_type === "customer" ? "1" : "2" });

if (!roleDoc) {
  return {
    status: 400,
    body: { message: "Role not found in Role collection" },
  };
}

// Then assign the ObjectId of the role
await UserRole.create({
  userId: newUser._id,
  roleId: roleDoc._id,
});


    // Create login account
    await LoginAccount.create({
      email,
      password: hashedPassword,
      active: true,
      createdDate,
      expiredDate,
    });

    return {
      status: 201,
      body: { message: "User registered successfully" },
    };
  } catch (error) {
    console.error("Service Error:", error);
    return {
      status: 500,
      body: { message: "Error registering user" },
    };
  }
};

module.exports = {
  signUpService,
};

