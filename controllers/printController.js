import Print from "../models/PrintModel.js";
import Setting from "../models/SettingsModel.js";
import User from "../models/UserModel.js";
import CreateNotification from "../utills/notification.js";
import Mongoose from "mongoose";

import moment from "moment";

const createPrint = async (req, res) => {
  const {
    vendorid,
    documentname,
    pages,
    type,
    userid,
    userName,
    requestformachine
  } = req.body;
  console.log("req.body", req.body);
  const setting = await Setting.findOne();
  console.log("setting", setting);
  const adminComission = setting.comissonsetting;
  const costperpage =
    type == "Color" ? setting.costforcolor : setting.costforblackandwhite;
  console.log("costperpage", costperpage, typeof costperpage);
  const totalcost = costperpage * pages;
  console.log("totalcost", totalcost);
  try {
    const print = new Print({
      vendorid,

      documentname,
      pages,
      adminComission,
      requestformachine,
      type,
      userid,
      userName,
      costperpage,
      totalcost
    });
    console.log("print", print);
    const user = await User.findById({ _id: userid });
    console.log("user", user);
    const updateuser = await User.findByIdAndUpdate(
      { _id: userid },
      { totalPrints: user.totalPrints + 1 },
      { new: true, upsert: true }
    ).exec();

    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const printcreated = await print.save();
    console.log("printcreated", printcreated);
    if (printcreated) {
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: "Print Created",
        body: `A user name ${userName} has printed a document named ${documentname} consisting of ${pages} pages which cost is ${totalcost}`,
        payload: {
          type: "PRINTER",
          id: userid
        }
      };
      CreateNotification(notification);

      res.status(201).json({
        printcreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const Printlogs = async (req, res) => {
  console.log("Printlogs", req.params.id, new Date(req.query.from));
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
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
    console.log("dateFilter", dateFilter);

    const print = await Print.paginate(
      {
        userid: req.params.id,
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "vendorid userid requestformachine"
      }
    );
    await res.status(200).json({
      print
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getVendorPrintlogs = async (req, res) => {
  console.log("PringetVendorPrintlogstlogs", req.query);
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              userName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            {
              printlocation: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            }
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
    console.log("dateFilter1", dateFilter);
    console.log("61839400187a3d5113e4e218", req.query.id);
    const print = await Print.paginate(
      {
        vendorid: Mongoose.mongo.ObjectId(req.query.id),
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
      print
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getAllPrintlogs = async (req, res) => {
  try {
    console.log(
      "req.query.searchString",
      req.query.searchString,
      req.query.from
    );

    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              userName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            {
              printlocation: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            }
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
          $gte: moment.utc(new Date(from)).startOf("day").toDate(),
          $lte: moment.utc(new Date(to)).endOf("day").toDate()
        }
      };
    console.log("dateFilter2", dateFilter);
    const print = await Print.paginate(
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
      print
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getPrintDetails = async (req, res) => {
  try {
    const print = await Print.findById(req.params.id);
    await res.status(201).json({
      print
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createPrint,
  Printlogs,
  getPrintDetails,
  getAllPrintlogs,
  getVendorPrintlogs
};
