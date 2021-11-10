import Notification from "../models/NotificationModel";

const getttingalltheNotification = async (req, res) => {
  try {
    const getAllNotification = await Notification.find();
    if (getAllNotification) {
      console.log('getAllNotification',getAllNotification)
      res.status(201).json({
        getAllNotification,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const getAllNotificationlogs = async (req, res) => {
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
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day"),
        },
      };
    console.log("dateFilter2", dateFilter);
    const notification = await Notification.paginate(
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
      notification,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const getSingleNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    await res.status(201).json({
      notification,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

const markallNotificationasRead = async (req, res) => {
  try {
    let notification = await Notification.updateMany(
      {},
      // { _id: { $in: req.body.notificationIds } },
      {
        $set: { isread: true },
      }
    );
    const getAllNotification=await Notification.find()
  console.log('notification',getAllNotification)
    res.status(200).json(getAllNotification);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });  }
};




export {
  getttingalltheNotification,
  getAllNotificationlogs,
  getSingleNotification,
  markallNotificationasRead
};
