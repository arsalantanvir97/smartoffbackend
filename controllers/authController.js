import asyncHandler from "express-async-handler";

import Admin from "../models/AdminModel.js";
import Reset from "../models/ResetModel.js";
import User from "../models/UserModel.js";

import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";
import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash,
} from "../queries";

const registerAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const AdminExists = await Admin.findOne({ email });

  if (AdminExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,

      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const authAdmin = asyncHandler(async (req, res) => {
  console.log("authAdmin");
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      userImage:admin.userImage,

      token: generateToken(admin._id),
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password",
    });
  }
});

const recoverPassword = asyncHandler(async (req, res) => {
  console.log("recoverPassword");
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.log("!admin");
    return res.status(401).json({
      message: "Invalid Email or Password",
    });
  } else {
    const status = generateCode();
    await createResetToken(email, status);

    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        \n\n Your verification status is ${status}:\n\n
        \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
        </p>`;
    await generateEmail(email, "Smart Off - Password Reset", html);
    return res.status(201).json({
      message:
        "Recovery status Has Been Emailed To Your Registered Email Address",
    });
  }
});
const verifyRecoverCode = asyncHandler(async (req, res) => {
  const { code, email } = req.body;

  const reset = await Reset.findOne({ email, code });
  // console.log("reset", reset);

  if (reset) {
    return res.status(200).json({ message: "Recovery status Accepted" });
  } else {
    return res.status(401).json({
      message: "Invalid Email or Password",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  console.log("reset");

  const { password, confirm_password, code, email } = req.body;

  if (!comparePassword(password, confirm_password))
    return res.status(400).json({ message: "Password Not Equal" });
  const reset = await Reset.findOne({ email, code });
  console.log("reset", reset);
  if (!reset)
    return res.status(400).json({ message: "Invalid Recovery status" });
  else {
    console.log("resetexist");
    const updatedadmin = await Admin.findOne({ email });
    updatedadmin.password = password;
    await updatedadmin.save();
    console.log("updatedadmin", updatedadmin);
    res.status(201).json({
      _id: updatedadmin._id,
      firstName: updatedadmin.firstName,
      userImage:updatedadmin.userImage,

      lastName: updatedadmin.lastName,
      email: updatedadmin.email,

      token: generateToken(updatedadmin._id),
    });
  }
  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
});

const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  const admin = await Admin.findOne();
  admin.firstName = firstName;
  admin.lastName = lastName;
  admin.userImage = user_image;
  await admin.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
await res.status(201).json({
    _id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    userImage:admin.userImage,
    token: generateToken(admin._id),
  })
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
console.log('user',user)
  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
})


export {
  registerAdmin,
  authAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  registerUser,
};
