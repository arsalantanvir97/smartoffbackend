import moment from "moment";
import Vendor from "../models/VendorModel.js";
import Print from "../models/PrintModel.js";
import Printer from "../models/PrinterModel.js";

import User from "../models/UserModel.js";

const logs = async (req, res) => {
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

    const users = await User.paginate(
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
      users,
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
    const user = await User.findById(req.params.id);
    console.log("user", user);
    user.status = user.status == true ? false : true;
    await user.save();
    await res.status(201).json({
      message: user.status ? "User Activated" : "User Deactivated",
    });
  } catch (err) {
    console.log("error", error);
    res.status(500).json({
      message: err.toString(),
    });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().select("-password");
    await res.status(201).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const getLatestUsers = async (req, res) => {
  try {
    const user = await User.find().sort({ $natural: -1 }).limit(5);

    await res.status(201).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
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
            $lte: end_date,
          },
        },
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: "$totalcost" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1,
        },
      },
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
              count: { $sum: "$totalcost" },
            },
          },
          {
            $project: {
              count: 1,
            },
          },
        ]),
        Print.aggregate(query),
      ]);

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
      graph_data: arr,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

export {
  logs,
  toggleActiveStatus,
  getUserDetails,
  getLatestUsers,
  getCountofallCollection,
};
