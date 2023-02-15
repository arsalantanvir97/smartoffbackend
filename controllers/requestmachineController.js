import RequestMachine from "../models/RequestMachineModel";
import moment from "moment";
import CreateNotification from "../utills/notification.js";
import Branch from "../models/BranchModel";
const createRequestMachine = async (req, res) => {
  const { organizationName, numberOfMachineReq, branchid, Message, vendorid } =
    req.body;
  console.log("req.body", req.body);
  try {
    const requestmachine = new RequestMachine({
      organizationName,
      numberOfMachineReq,
      branchid: JSON.parse(branchid),
      Message,
      vendorid,
      idofvendor: vendorid
    });
    console.log("requestmachine", requestmachine);
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const requestmachinecreated = await requestmachine.save();
    console.log("requestmachinecreated", requestmachinecreated);
    if (requestmachinecreated) {
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: "Request Machine",
        body: `${organizationName} has request for ${numberOfMachineReq} machines`,
        payload: {
          type: "SUBSCRIPTION",
          id: vendorid
        }
      };
      CreateNotification(notification);
      res.status(201).json({
        requestmachinecreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const RequestMachinelogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              organizationName: {
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

    const requestmachine = await RequestMachine.paginate(
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
        populate: "vendorid branchid"
      }
    );
    await res.status(200).json({
      requestmachine
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getRequestMachineDetails = async (req, res) => {
  try {
    const requestmachine = await RequestMachine.findById(
      req.params.id
    ).populate("vendorid branchid");
    await res.status(201).json({
      requestmachine
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getRequestMachinebyVendorid = async (req, res) => {
  const { vendorid } = req.body;
  console.log("getRequestMachinebyVendoridvendorid", vendorid);
  try {
    const requestmachine = await RequestMachine.find({
      vendorid: vendorid
    }).populate("vendorid branchid");
    console.log("getRequestMachinebyVendorid", requestmachine);
    await res.status(201).json({
      requestmachine
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getRequestMachine = async (req, res) => {
  try {
    const requestmachine = await RequestMachine.find().populate(
      "vendorid branchid"
    );
    await res.status(201).json({
      requestmachine
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createRequestMachine,
  RequestMachinelogs,
  getRequestMachineDetails,
  getRequestMachinebyVendorid,
  getRequestMachine
};
