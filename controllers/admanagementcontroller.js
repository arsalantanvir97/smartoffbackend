import AdmanagementModel from "../models/AdmanagementModel";
import moment from "moment";
import CreateNotification from "../utills/notification.js";
import AdManagementCostModel from "../models/AdManagementCostModel";
import ExpiryDate from "../services/expiry_date";
const createAdmanagement = async (req, res) => {
  const { vendorid, link, message } = req.body;
  console.log("req.body", req.files);
  let videoUri =
    req.files &&
    req.files.ad_video &&
    req.files.ad_video[0] &&
    req.files.ad_video[0].path;
  try {
    const costforAdd = await AdManagementCostModel.findOne();
    const admanagement = new AdmanagementModel({
      vendorid,
      link,
      message,
      videoUri,
      cost: costforAdd.cost
    });
    console.log("feedback", admanagement);
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const admanagementcreated = await admanagement.save();
    console.log("admanagementcreated", admanagementcreated);
    if (admanagementcreated) {
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: "Ad",
        body: `Add has been created which now waits your approval`,
        payload: {
          type: "Ad",
          id: vendorid
        }
      };
      CreateNotification(notification);

      res.status(201).json({
        admanagementcreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const Admanagementlogs = async (req, res) => {
  try {
    ExpiryDate();
    console.log("req.query.searchString", req.query.searchString);
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
    console.log("req.query.status", req.query.status);
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

    const admanagement = await AdmanagementModel.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "vendorid"
      }
    );
    await res.status(200).json({
      admanagement
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getAdmanagementDetails = async (req, res) => {
  try {
    const admanagement = await AdmanagementModel.findById(
      req.params.id
    ).populate("vendorid");
    await res.status(201).json({
      admanagement
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const setCostforAd = async (req, res) => {
  console.log("req", req.body.cost, typeof req.body.cost);
  console.log("api hit1");
  const cost = Number(req.body.cost);
  try {
    const costforAdd = await AdManagementCostModel.findOneAndUpdate(
      {},
      {
        cost
      }
    );
    const costforAddrcreated = await costforAdd.save();

    await res.status(201).json({
      message: "Cost set for Ad"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const rejectAd = async (req, res) => {
  const { id, rejectreason } = req.body;

  try {
    const rejectad = await AdmanagementModel.findByIdAndUpdate(
      { _id: id },
      { rejectreason: rejectreason, status: "Rejected" },
      { new: true, upsert: true }
    ).exec();

    await res.status(201).json({
      rejectad
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const approveAd = async (req, res) => {
  const { id } = req.body;

  try {
    const approvead = await AdmanagementModel.findByIdAndUpdate(
      { _id: id },
      { status: "Approved" },
      { new: true, upsert: true }
    ).exec();

    await res.status(201).json({
      approvead
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteAd = async (req, res) => {
  try {
    await AdmanagementModel.findByIdAndRemove(req.params.id);
    return res.status(201).json({ message: "Ad Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const paymentofAd = async (req, res) => {
  const { id, paymentdetials } = req.body;

  try {
    const admanagement = await AdmanagementModel.findOne({ _id: id });
    admanagement.paid = true;
    admanagement.paymentDetails = paymentdetials;
    console.log('admanagement',admanagement)
    await admanagement.save()
    await res.status(201).json({
      admanagement
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updatestatus = async (req, res) => {
  const { id } = req.body;

  try {
    const admanagement = await AdmanagementModel.findOne({ _id: id });
  
    admanagement.status = 'Pending';
    console.log('admanagement',admanagement)
    await admanagement.save()
    await res.status(201).json({
      admanagement
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createAdmanagement,
  Admanagementlogs,
  getAdmanagementDetails,
  setCostforAd,
  rejectAd,
  approveAd,
  deleteAd,
  paymentofAd,
  updatestatus
};
