import Print from "../models/PrintModel.js";
import Setting from "../models/SettingsModel.js";
import User from "../models/UserModel.js";

import moment from "moment";

const createPrint = async (req, res) => {
  const {
    vendorid,
    printerid,
    documentname,
    pages,
    printlocation,
    type,
    userid,
    userName,
  } = req.body;
  console.log("req.body", req.body);
  const printid = Math.floor(10000 + Math.random() * 900000);
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
      printerid,
      printid,
      documentname,
      pages,
      adminComission,
      printlocation,
      type,
      userid,
      userName,
      costperpage,
      totalcost,
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
      res.status(201).json({
        printcreated,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
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
          $lte: moment.utc(new Date(to)).endOf("day"),
        },
      };
    console.log("dateFilter", dateFilter);

    const print = await Print.paginate(
      {
        userid: req.params.id,
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
      print,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};
const getVendorPrintlogs = async (req, res) => {
  console.log("PringetVendorPrintlogstlogs", req.params.id);
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
          $lte: moment.utc(new Date(to)).endOf("day"),
        },
      };
    console.log("dateFilter", dateFilter);

    const print = await Print.paginate(
      {
        vendorid: req.params.id,
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
      print,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
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
      ? { $text: { $search: req.query.searchString } }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};
    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gt: new Date(from),
          $lt: new Date(to),
        },
      };
    console.log("dateFilter", dateFilter);
    const print = await Print.paginate(
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
      print,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const getPrintDetails = async (req, res) => {
  try {
    const print = await Print.findById(req.params.id);
    await res.status(201).json({
      print,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

export {
  createPrint,
  Printlogs,
  getPrintDetails,
  getAllPrintlogs,
  getVendorPrintlogs,
};
