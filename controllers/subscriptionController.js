import Subscription from "../models/SubscriptionModel.js";
import moment from "moment";
import CreateNotification from "../utills/notification.js";
import User from "../models/UserModel.js";
import VendorSubscription from "../models/VendorSubscriptionModel.js";

const createSubscription = async (req, res) => {
  const { packagename, duration, amount, Features, status, noofpagesscan,
    storagememory,
    noofpagesprint,
    internethours } = req.body;
  console.log("req.bodycreateSubscription", req.body);
  try {
    const subscription = new Subscription({
      packagename,
      duration,
      amount,
      Features,
      status, noofpagesscan,
      storagememory,
      noofpagesprint,
      internethours
    });
    console.log("subscription", subscription);
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const allOfSubscriptions = await subscription.save();
    console.log("allOfSubscriptions", allOfSubscriptions);
    if (allOfSubscriptions) {
      res.status(201).json({
        allOfSubscriptions
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const createVendorSubscription = async (req, res) => {

  try {
    const subscription = new VendorSubscription(req.body);
    console.log("subscription", subscription);
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const allOfSubscriptions = await subscription.save();
    console.log("allOfSubscriptions", allOfSubscriptions);
    if (allOfSubscriptions) {
      res.status(201).json({
        allOfSubscriptions
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const allOfSubscription = async (req, res) => {
  try {
    const getAllSubscriptions = await Subscription.find();
    console.log("getAllSubscriptions", getAllSubscriptions);
    if (getAllSubscriptions) {
      res.status(201).json({
        getAllSubscriptions
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const allvendorsubscription = async (req, res) => {
  try {
    const getAllSubscriptions = await VendorSubscription.find();
    console.log("getAllSubscriptions", getAllSubscriptions);
    if (getAllSubscriptions) {
      res.status(201).json({
        getAllSubscriptions
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getSingleSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    await res.status(201).json({
      subscription
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updateSubscription = async (req, res) => {
  const { id, packagename, duration, cost, status, Features,noofpagesscan,
    storagememory,
    noofpagesprint,
    internethours  } = req.body;
  console.log("req.body", req.body);
  const subscription = await Subscription.findByIdAndUpdate(
    { _id: id },
    {
      packagename,
      Features,
      duration,
      amount: cost,
      status,
      noofpagesscan,
    storagememory,
    noofpagesprint,
    internethours 
    },
    { new: true }
  );

  if (subscription) {
    console.log("subscriptionsubscription");
    const notification = {
      notifiableId: null,
      notificationType: "Vendor",
      title: "Subscription Updated",
      body: `${packagename} package name cost:${cost},duration:${duration} updated `,
      payload: {
        type: "Admin",
        id: id
      }
    };
    CreateNotification(notification);

    res.json(subscription);
  } else {
    res.status(404);
    throw new Error("subscription not found");
  }
};
const subscriptionPayment = async (req, res) => {
  const {
    subscription_id,
    card_holder_name,
    card_number,
    cvv,
    userid,
    zip_code,
    address,
    is_recurring
  } = req.body;
  try {
    var now = new Date();
    const user = await User.findById({ _id: userid });
    const subscriptionn = await Subscription.findOne({ _id: subscription_id });
    console.log("user", user);
    user.subscriptionid = subscription_id;
    user.subscription = subscriptionn;
    user.is_recurring = is_recurring;
    user.paymentResult = {
      card_holder_name,
      card_number,
      cvv,
      zip_code,
      address
    };
    user.expiryDate = new Date(
      now.setDate(now.getDate() + subscriptionn.duration)
    );

    const updateduser = await user.save();

    console.log("paymentOfSubscription");
    await res.status(201).json({
      message:
        "Congratulations! You have successfully subscribed to our package",
      user: updateduser
    });
  } catch (err) {
    console.log("error", error);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteSubscription = async (req, res) => {
  try {
    await Subscription.findByIdAndRemove(req.params.id);
    return res.status(201).json({ message: "Subscription Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteVendorSubscription = async (req, res) => {
  try {
    await VendorSubscription.findByIdAndRemove(req.params.id);
    return res.status(201).json({ message: "Subscription Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createSubscription,
  allOfSubscription,
  getSingleSubscription,
  updateSubscription,
  subscriptionPayment,
  deleteSubscription,
  createVendorSubscription,
  allvendorsubscription,
  deleteVendorSubscription
};
