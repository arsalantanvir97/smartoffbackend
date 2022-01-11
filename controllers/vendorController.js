import Vendor from "../models/VendorModel.js";
import asyncHandler from "express-async-handler";
import CreateNotification from "../utills/notification.js";
import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";

import moment from "moment";
import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";
import Reset from "../models/ResetModel.js";
const registerVendor = async (req, res) => {
  const { firstName, confirmpassword, email,phone, password, organizationName } = req.body;
 
  if (!comparePassword(password, confirmpassword))
    return res.status(401).json({ error: "Password does not match" });
  const VendorExists = await Vendor.findOne({ email });

  if (VendorExists) {
    return res.status(401).json({
      error: "Vendor already exist"
    });
  }

  const vendor = await Vendor.create({
    firstName, email,phone, password, organizationName
  });
  console.log("vendor", vendor);
  if (vendor) {
    const notification = {
      notifiableId: null,
      notificationType: "Vendor",
      title: `Vendor Created`,
      body: `A Vendor name ${firstName} has registered`,
      payload: {
        type: "Vendor",
        id: vendor._id
      }
    };
    CreateNotification(notification);
    await vendor.save();
    await res.status(201).json({
      _id: vendor._id,
      firstName: vendor.firstName,
      email: vendor.email,
      phone: vendor.phone,
      organizationName:vendor.organizationName,
      token: generateToken(vendor._id),
      message: "Successfully created vendor!"
    });
  } else {
    return res.status(401).json({
      error: "false"
    });
  }
};
const authVendor = asyncHandler(async (req, res) => {
  console.log("authVendor");
  const { email, password } = req.body;

  const vendor = await Vendor.findOne({ email });
  if (vendor && (await vendor.matchPassword(password))) {
    await res.status(200).json({
      _id: vendor._id,
      firstName: vendor.firstName,
      email: vendor.email,
      phone: vendor.phone,
      organizationName:vendor.organizationName,
      token: generateToken(vendor._id),
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});
const recoverPassword = async (req, res) => {
  console.log("recoverPassword");
  const { email } = req.body;
  console.log("req.body", req.body);
  const vendor = await Vendor.findOne({ email });
  if (!vendor) {
    console.log("!vendor");
    return res.status(401).json({
      message: "Invalid Email or Password"
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
        "Recovery status Has Been Emailed To Your Registered Email Address"
    });
  }
};
const verifyRecoverCode = async (req, res) => {
  const { code, email } = req.body;
  console.log("req.body", req.body);
  const reset = await Reset.findOne({ email, code });

  if (reset)
    return res.status(200).json({ message: "Recovery status Accepted" });
  else {
    return res.status(400).json({ message: "Invalid Code" });
  }
  // console.log("reset", reset);
};
const resetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { password, confirm_password, code, email } = req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirm_password))
      return res.status(400).json({ message: "Password does not match" });
    const reset = await Reset.findOne({ email, code });
    console.log("reset", reset);
    if (!reset)
      return res.status(400).json({ message: "Invalid Recovery status" });
    else {
      console.log("resetexist");
      const updatedvendor = await Vendor.findOne({ email });
      updatedvendor.password = password;
      await updatedvendor.save();
      console.log("updatedvendor", updatedvendor);
      res.status(201).json({
        _id: updatedvendor._id,
        firstName: updatedvendor.firstName,
        email: updatedvendor.email,
        phone: updatedvendor.phone,
        organizationName:updatedvendor.organizationName,
        token: generateToken(updatedvendor._id),
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
};

const editProfile = async (req, res) => {
  const { username, email } = req.body;
  // console.log("req.body", req.body);
  console.log("req.body.fullName", req.body.fullName);

  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("user_image", user_image);
  const user = await User.findOne({ email });
  console.log("user", user);
  user.username = username;
  user.userImage = user_image ? user_image : user.userImage;
  await user.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    type: user.type,
    userImage: user.userImage,
    token: generateToken(user._id)
  });
};

const Vendorlogs = async (req, res) => {
    try {
      console.log('req.query.searchString',req.query.searchString)
      const searchParam = req.query.searchString
      ?
      // { $text: { $search: req.query.searchString } }
      {
        $or: [
          { firstName: { $regex: `${req.query.searchString}`, $options: "i" } },
        ],
      }

      : {};
      const status_filter = req.query.status ? { status: req.query.status } : {};
      const from = req.query.from ;
      const to = req.query.to;
      let dateFilter = {};
      if (from && to)
        dateFilter = {
          createdAt: {
            $gte: moment.utc(new Date(from)).startOf("day"),
            $lte: moment.utc(new Date(to)).endOf("day"),
          },
        };
  
      const vendors = await Vendor.paginate(
        {
          ...searchParam,
          ...status_filter,
          ...dateFilter,
        },
        {
          page: req.query.page,
          limit: req.query.perPage,
          lean: true,
          sort: "-_id",
        }
      );
      await res.status(200).json({
        vendors,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const toggleActiveStatus = async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      console.log('vendor',vendor)
      vendor.status = vendor.status == true ? false : true;
      console.log('vendor1',vendor)

      await vendor.save();
      console.log('vendor2')

      await res.status(201).json({
        message: vendor.status ? "Vendor Activated" : "Vendor Deactivated",
      });
    } catch (err) {
        console.log('error',err)

      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const getVendorDetails = async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id).lean().select("-password");
      await res.status(201).json({
        vendor,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  
  export { Vendorlogs ,toggleActiveStatus,getVendorDetails,
    registerVendor,
    authVendor,
    recoverPassword,
    verifyRecoverCode,
    resetPassword,
    editProfile,
  };
