import moment from "moment";
import Vendor from "../models/VendorModel.js";
import Print from "../models/PrintModel.js";
import Printer from "../models/PrinterModel.js";

import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import CreateNotification from "../utills/notification.js";
import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";

import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";
import Reset from "../models/ResetModel.js";
import Mongoose from "mongoose";
const registerUser = async (req, res) => {
  const { firstName, confirmpassword, email, lastName, password } = req.body;

  if (!comparePassword(password, confirmpassword))
    return res.status(401).json({ error: "Password does not match" });
  const UserExists = await User.findOne({ email });

  if (UserExists) {
    return res.status(401).json({
      error: "User already exist"
    });
  }

  const user = await User.create({
    firstName,
    email,
    lastName,
    password
  });
  console.log("user", user);
  if (user) {
    const notification = {
      notifiableId: null,
      notificationType: "Admin",
      title: `User Created`,
      body: `A user name ${firstName} has registered`,
      payload: {
        type: "User",
        id: user._id
      }
    };
    CreateNotification(notification);
    await user.save();
    await res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
      token: generateToken(user._id),
      message: "Successfully created user!"
    });
  } else {
    return res.status(401).json({
      error: "false"
    });
  }
};
const authUser = asyncHandler(async (req, res) => {
  console.log("authUser");
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("subscriptionid");
  console.log("user", user);
  if (user && (await user.matchPassword(password))) {
    await res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
      userImage: user.userImage,
      subscription: user.subscription,
      subscriptionid: user.subscriptionid,

      token: generateToken(user._id)
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
  const user = await User.findOne({ email });
  if (!user) {
    console.log("!user");
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
      const updateduser = await User.findOne({ email }).populate(
        "subscriptionid"
      );
      updateduser.password = password;
      await updateduser.save();
      console.log("updateduser", updateduser);
      res.status(201).json({
        _id: updateduser._id,
        firstName: updateduser.firstName,
        lastName: updateduser.lastName,
        userImage: updateduser.userImage,
        subscription: user.subscription,
        subscriptionid: user.subscriptionid,
        email: updateduser.email,
        token: generateToken(updateduser._id)
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
  const { firstName, lastName, id } = req.body;
  console.log("req.body", req.body);

  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("user_image", user_image);
  const user = await User.findOne({ _id: id }).populate("subscriptionid");
  console.log("user", user);
  user.firstName = firstName ? firstName : user.firstName;
  user.lastName = lastName ? lastName : user.lastName;
  user.userImage = user_image ? user_image : user.userImage;
  await user.save();

  await res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    email: user.email,
    lastName: user.lastName,
    userImage: user.userImage,
    subscription: user.subscription,
    subscriptionid: user.subscriptionid,
    token: generateToken(user._id)
  });
};

const verifyAndREsetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { existingpassword, newpassword, confirm_password, email } = req.body;

    console.log("req.body", req.body);
    const user = await User.findOne({ email }).populate("subscriptionid");

    if (user && (await user.matchPassword(existingpassword))) {
      console.log("block1");
      if (!comparePassword(newpassword, confirm_password)) {
        console.log("block2");
        return res.status(400).json({ message: "Password does not match" });
      } else {
        console.log("block3");
        user.password = newpassword;
        await user.save();
        console.log("user", user);
        res.status(201).json({
          _id: user._id,
          firstName: user.firstName,
          email: user.email,
          lastName: user.lastName,
          subscription: user.subscription,
          subscriptionid: user.subscriptionid,
          userImage: user.userImage,
          token: generateToken(user._id)
        });
      }
    } else {
      console.log("block4");

      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }
};

const logs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              firstName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            { lastName: { $regex: `${req.query.searchString}`, $options: "i" } }
          ]
        }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};
    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day")
        }
      };

    const users = await User.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id"
      }
    );
    await res.status(200).json({
      users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const toggleActiveStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("user", user);
    user.status = user.status == true ? false : true;
    await user.save();
    await res.status(201).json({
      message: user.status ? "User Activated" : "User Deactivated"
    });
  } catch (err) {
    console.log("error", error);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("subscriptionid");
    await res.status(201).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getLatestUsers = async (req, res) => {
  try {
    const user = await User.find().sort({ $natural: -1 }).limit(5);

    await res.status(201).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getCountofallCollection = async (req, res) => {
  try {
    const { year } = req.params;
    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const start_date = moment(year).startOf("year").toDate();
    const end_date = moment(year).endOf("year").toDate();
    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date
          }
        }
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt"
          }
        }
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: "$totalcost" }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1
        }
      }
    ];
    const [user, vendor, print, printer, allprinter, total_cost, salesCount] =
      await Promise.all([
        User.count(),
        Vendor.count(),
        Print.count(),
        Printer.count(),
        Printer.find(),
        Print.aggregate([
          {
            $group: {
              _id: 1,
              count: { $sum: "$totalcost" }
            }
          },
          {
            $project: {
              count: 1
            }
          }
        ]),
        Print.aggregate(query)
      ]);
    console.log("salesCount", salesCount);
    salesCount.forEach((data) => {
      if (data) arr[data.month - 1] = data.count;
    });

    await res.status(201).json({
      user,
      vendor,
      print,
      printer,
      allprinter,
      total_cost,
      graph_data: arr
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const paymentOfSubscription = async (req, res) => {

  const { id, subscription, userid } = req.body;
  try {
    var now = new Date();
    const user = await User.findById({ _id: userid });
    console.log("user", user);
    user.subscriptionid = id;
    user.subscription = subscription;
    user.expiryDate = new Date(
      now.setDate(now.getDate() + subscription.duration)
    );

    await user.save();
    const notification = {
      notifiableId: userid,
      notificationType: "User",
      title: "Subscription",
      body: `You have successfully subscribed to one of our package`,
      payload: {
        type: "Subscription",
        id: userid
      }
    };
    CreateNotification(notification);
    console.log('paymentOfSubscription');
    await res.status(201).json({
      message: "Payment made Successfully"
    });
  } catch (err) {
    console.log("error", error);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getUserDetailsandCheckSubscrptionExpiry = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("subscriptionid")
      .lean()
      .select("-password");
    if (user.expiryDate) {
      var date = moment(user.expiryDate);
      var now = moment();
      if (now > date) {
        await User.updateOne(
          { _id: req.params.id },
          { $unset: { subscriptionid: "", subscription: "", expiryDate: "" } }
        );
      }
    }
    await res.status(201).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  logs,
  toggleActiveStatus,
  getUserDetails,
  getLatestUsers,
  getCountofallCollection,
  registerUser,
  authUser,
  verifyRecoverCode,
  recoverPassword,
  resetPassword,
  editProfile,
  verifyAndREsetPassword,
  paymentOfSubscription,
  getUserDetailsandCheckSubscrptionExpiry
};
