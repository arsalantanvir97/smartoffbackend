import moment from "moment";
import Vendor from "../models/VendorModel.js";
import Print from "../models/PrintModel.js";
import Printer from "../models/PrinterModel.js";

import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import CreateNotification from "../utills/notification.js";
import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";
import Session from "../models/SessionModel";
import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash,
  createOTPToken
} from "../queries";
import Reset from "../models/ResetModel.js";
import Mongoose from "mongoose";
import RequestMachine from "../models/RequestMachineModel.js";
import Branch from "../models/BranchModel.js";
import OTP from "../models/OTPModel.js";
// import { nanoid }from "nanoid";
// import {
//   CreateGoogleUser,
//   CreateFacebookUser,
//   CreateAppleUser
// } from "../services/CreateSocialUsers";
// import { GetGoogleUser, GetFacebookUser } from "../services/GetSocialUsers";

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
        subscription: updateduser.subscription,
        subscriptionid: updateduser.subscriptionid,
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
          country_code: user.country_code,
          mobile_number: user.mobile_number,
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
        RequestMachine.count(),
        RequestMachine.find().populate("vendorid branchid"),
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

    console.log("paymentOfSubscription");
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

const cancelationOfSubscription = async (req, res) => {
 
  try {
    const user = await User.findById({ _id: req.id });
    console.log("user", user);
    user.subscriptionid = undefined;
    user.subscription = undefined;
    user.expiryDate = undefined;
    user.is_recurring = undefined;
    user.paymentResult = undefined;
    await user.save();

    console.log("cancelationOfSubscription");
    await res.status(201).json({
      message: "Subscription Cancelled"
    });
  } catch (err) {
    console.log("err", err);
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

const SocialLogin = async (req, res) => {
  let usersession 
  if (req.body.method == "google") {
    try {
      const token = req.body.access_token ? req.body.access_token : "";
      const Googleuser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
      );

      if (Googleuser.data) {
        let user = await User.findOne({ email: Googleuser.data.email });
        if (user) {
          const token = generateToken(user._id);
          usersession = await Session.findOneAndUpdate(
            { user: user._id },
            { deviceId: req.body.deviceId,deviceType:req.body.device_type, status: true, token: token, },
            { new: true, upsert: true, returnNewDocument: true }
          );
          console.log("googleusersession", usersession);
         await usersession.save();
         


          return res.status(200).json({
            message: "Log in Successfull",
            user: user,
            token: token
          });
        }

        //if password doesnot match

        //decode the base 4 image
        let pathName;

        const response = await fetch(Googleuser.data.picture);
        const buffer = await response.buffer();
        let r = Math.random().toString(36).substring(7);
        pathName = `uploads/${r}.png`;
        fs.writeFileSync(path.join(__dirname, `../${pathName}`), buffer);

        //create new user
        user = new User({
          firstName: Googleuser.data.given_name,
          lastName: Googleuser.data.family_name,
          email: Googleuser.data.email,
          location: {
            type: "Point",
            coordinates: req.body.location ? req.body.location : null
          },
          // location: req.body.location ? req.body.location : null,
          userImage: pathName,
          googleId: Googleuser.data.id

          //   image: req.file.path
        });
        await user.save();

        const token = generateToken(user._id);
        
        usersession = await Session.findOneAndUpdate(
          { user: user._id },
          { deviceId: req.body.deviceId,deviceType:req.body.device_type, status: true, token: token, },
          { new: true, upsert: true, returnNewDocument: true }
        );
        console.log("googleusersession", usersession);
       await usersession.save();

        return res.status(200).json({
          message: "Log in Successfull",
          user: user,
          token: token
        });
      }
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  } else if (req.body.method == "facebook") {
    try {
      let access_token = req.body.access_token ? req.body.access_token : "";

      const Facebookuser = await axios({
        url: "https://graph.facebook.com/me",
        method: "get",
        params: {
          fields: ["id", "email", "first_name", "last_name", "picture"].join(
            ","
          ),
          access_token: access_token
        }
      });
      //   console.log(Facebookuser.data.picture.data.url)

      if (Facebookuser.data) {
        let user = await User.findOne({ email: Facebookuser.data.email });
        if (user) {
          const token = generateToken(user._id)
          usersession = await Session.findOneAndUpdate(
            { user: user._id },
            { deviceId: req.body.deviceId,deviceType:req.body.device_type, status: true, token: token, },
            { new: true, upsert: true, returnNewDocument: true }
          );
          console.log("googleusersession", usersession);
         await usersession.save();

          return res.status(200).json({
            message: "Log in Successfull",
            user: user,
            token: token
          });
        }

        //if password doesnot match

        //decode the base 4 image
        let pathName;
        const response = await fetch(Facebookuser.data.picture.data.url);
        const buffer = await response.buffer();
        let r = Math.random().toString(36).substring(7);
        pathName = `uploads/images/${r}.png`;
        // console.log("pathname",pathName)
        fs.writeFileSync(path.join(__dirname, `../${pathName}`), buffer);

        //create new user
        user = new User({
          firstName: Facebookuser.data.first_name,
          lastName: Facebookuser.data.last_name,
          email: Facebookuser.data.email,
          location: {
            type: "Point",
            coordinates: req.body.location ? req.body.location : null
          },
          userImage: pathName,
          facebookId: Facebookuser.data.id

          //   image: req.file.path
        });
        await user.save();
        const token = await generateToken(user._id)
        usersession = await Session.findOneAndUpdate(
          { user: user._id },
          { deviceId: req.body.deviceId,deviceType:req.body.device_type, status: true, token: token, },
          { new: true, upsert: true, returnNewDocument: true }
        );
        console.log("googleusersession", usersession);
       await usersession.save();
        return res.status(200).json({
          message: "Log in Successfull",
          user: user,
          token: token
        });
      }
    } catch (err) {
      const errors = [];
      errors.push({ message: err.message });
      res.status(500).json({ errors: errors });
    }

    //return json webtoken
  } else if (req.body.method == "apple") {
    const { first_name, last_name, email, apple_user_id, method, role } =
      req.body;
    try {
      let user = await User.findOne({ appleId: apple_user_id });

      if (user) {
        const token = generateToken(user._id)
        usersession = await Session.findOneAndUpdate(
          { user: user._id },
          { deviceId: req.body.deviceId,deviceType:req.body.device_type, status: true, token: token, },
          { new: true, upsert: true, returnNewDocument: true }
        );
        console.log("googleusersession", usersession);
       await usersession.save();


        return res.status(200).json({
          message: "Log in Successfull",
          user: user,
          token: token
        });
      }

      //if password doesnot match

      //decode the base 4 image
      const random_number = Math.random().toString(36).substring(7);
      //create new user
      user = new User({
        firstName: first_name ? first_name : "",
        lastName: last_name ? last_name : "",
        email: email ? email : "",
        location: {
          type: "Point",
          coordinates: req.body.location ? req.body.location : null
        },

        userImage: "",
        appleId: apple_user_id,
        password: `${random_number}_this_is_a_social_login_register_${random_number}`

        //   image: req.file.path
      });
      await user.save();
      const token = await user.generateAuthToken();
      usersession = await Session.findOneAndUpdate(
        { user: user._id },
        { deviceId: req.body.deviceId,deviceType:req.body.device_type, status: true, token: token, },
        { new: true, upsert: true, returnNewDocument: true }
      );
      console.log("googleusersession", usersession);
     await usersession.save();

      return res.status(200).json({
        message: "Log in Successfull",
        user: user,
        token: token
      });
    } catch (err) {
      const errors = [];
      errors.push({ message: err.message });
      res.status(500).json({ errors: errors });
    }

    //return json webtoken
  } else {
    res.status(400).json({
      message: "Unsupported Login Method"
    });
  }

  //return json webtoken
};

const login = asyncHandler(async (req, res) => {
  console.log("authUser");
  const { email, password, deviceId,device_type } = req.body;

  const user = await User.findOne({ email }).populate("subscriptionid");
  console.log("user", user);
  if (user && (await user.matchPassword(password))) {
    const createdataofusers = await Session.findOneAndUpdate(
      { user: user._id },
      { deviceId: deviceId,deviceType:device_type },
      { new: true, upsert: true, returnNewDocument: true }
    );
    console.log("createdataofusers", createdataofusers);
    const abc = await createdataofusers.save();
    await res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
      userImage: user.userImage,
      subscription: user.subscription,
      subscriptionid: user.subscriptionid,
      country_code: user.country_code,
      mobile_number: user.mobile_number,
      token: generateToken(user._id)
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});

const Singup = async (req, res) => {
  const {
    firstName,
    confirmpassword,
    email,
    lastName,
    password,
    mobile_number,
    country_code
  } = req.body;

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
    password,
    mobile_number,
    country_code
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
      country_code: user.country_code,
      mobile_number: user.mobile_number,

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

const forgotPassword = async (req, res) => {
  const { mobile_number, country_code } = req.body;

  const user = await User.findOne({ mobile_number, country_code });
  if (!user) {
    console.log("!user");
    return res.status(401).json({
      message: "Invalid Mobile Number or Country Code"
    });
  } else {
    const status = generateCode();
    await createOTPToken(mobile_number, country_code, status);

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

const verifyCode = async (req, res) => {
  const { code } = req.body;
  console.log("req.body", req.body);
  const reset = await OTP.findOne({ code });
  if (reset)
    return res.status(200).json({ message: "Recovery status Accepted" });
  else {
    return res.status(400).json({ message: "Invalid Code" });
  }
};

const updatePassword = async (req, res) => {
  try {
    console.log("reset");

    const { password, confirm_password, code, mobile_number, country_code } =
      req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirm_password))
      return res.status(400).json({ message: "Password does not match" });
    const reset = await OTP.findOne({ mobile_number, country_code, code });
    console.log("reset", reset);
    if (!reset)
      return res.status(400).json({ message: "Invalid Recovery status" });
    else {
      console.log("resetexist");
      const updateduser = await User.findOne({ mobile_number, country_code }).populate(
        "subscriptionid"
      );
      updateduser.password = password;
      await updateduser.save();
      console.log("updateduser", updateduser);
      res.status(201).json({
        _id: updateduser._id,
        firstName: updateduser.firstName,
        email: updateduser.email,
        lastName: updateduser.lastName,
        userImage: updateduser.userImage,
        subscription: updateduser.subscription,
        subscriptionid: updateduser.subscriptionid,
        country_code: updateduser.country_code,
        mobile_number: updateduser.mobile_number,
        token: generateToken(updateduser._id)
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }
};

const updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    mobile_number,
    country_code,
    id
  } = req.body;
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
  user.email = email ? email : user.email;
  user.password = password ? password : user.password;
  user.mobile_number = mobile_number ? mobile_number : user.mobile_number;
  user.country_code = country_code ? country_code : user.country_code;
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
    country_code: user.country_code,
    mobile_number: user.mobile_number,
    token: generateToken(user._id)
  });
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
  getUserDetailsandCheckSubscrptionExpiry,
  login,
  Singup,
  forgotPassword,
  verifyCode,
  updatePassword,
  SocialLogin,
  updateProfile,
  cancelationOfSubscription
};
