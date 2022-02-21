import Branch from "../models/BranchModel";
import moment from "moment";
import CreateNotification from "../utills/notification.js";
import Mongoose from "mongoose";

const createBranch = async (req, res) => {
  const {
    branchName,
    country,
    city,
    zipcode,
    address,
    vendorid,
    geolocation
  } = req.body;
  console.log("req.body", req.body);
  try {
    const branch = new Branch({
      branchName,
      country,
      city,
      zipcode,
      address,
      vendorid,geolocation
    });
    console.log("branch", branch);
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const branchcreated = await branch.save();
    console.log("branchcreated", branchcreated);
    if (branchcreated) {
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: "Branch Created",
        body: `Branch created by a vendor having id of${vendorid} `,
        payload: {
          type: "Vendor",
          id: vendorid
        }
      };
      CreateNotification(notification);

      res.status(201).json({
        branchcreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const Branchlogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              branchName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            {
              address: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            }
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

    const branch = await Branch.paginate(
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
        branch
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getBranchDetails = async (req, res) => {
    const { id } = req.body;
  console.log('req',req.body,id)
    try {
      const branch = await Branch.findOne({ _id: id }).populate('vendorid');
     
      await res.status(201).json({
        branch
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  

  const editBranch = async (req, res) => {
    const { id, branchName,
        country,
        city,
        zipcode,
        address,
        geolocation,
        vendorid } = req.body;
    console.log("req.body", req.body);
    console.log( geolocation ? 'yes' : 'no');

    const branch = await Branch.findOne({ _id: id });
    console.log("branch", branch);
    branch.branchName = branchName ? branchName : branch.branchName;
    branch.country = country ? country : branch.country;
    branch.city = city ? city : branch.city;
    branch.zipcode = zipcode ? zipcode : branch.zipcode;
    branch.address = address ? address : branch.address;
    branch.geolocation = geolocation ? geolocation : branch.geolocation;
    
    console.log("block1");
   
  
    await branch.save();
    await res.status(201).json({
        branch
    });
  };
  const allBranchesofVendor = async (req, res) => {
    const { id } = req.body;
  console.log('req',req.body,id)
    try {
      const branches = await Branch.find({vendorid:id}).populate('vendorid');
     
      await res.status(201).json({
        branches
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const allBranches = async (req, res) => {
    try {
      const branches = await Branch.find().populate('vendorid');
     
      await res.status(201).json({
        branches
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const deleteBranch = async (req, res) => {
    try {
      await Branch.findByIdAndRemove(req.params.id);
      return res.status(201).json({ message: "Branch Deleted" });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };



  const BranchlogsofVendor = async (req, res) => {
    try {
      console.log("req.query.searchString", req.query.searchString);
      const searchParam = req.query.searchString
        ? // { $text: { $search: req.query.searchString } }
          {
            $or: [
              {
                branchName: { $regex: `${req.query.searchString}`, $options: "i" }
              },
              {
                address: {
                  $regex: `${req.query.searchString}`,
                  $options: "i"
                }
              }
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
  
      const branch = await Branch.paginate(
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
          sort: "-_id",
          populate: "vendorid"
        }
      );
      await res.status(200).json({
          branch
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString()
      });
    }
  };
export { createBranch ,Branchlogs,getBranchDetails,editBranch,allBranches,deleteBranch,BranchlogsofVendor,allBranchesofVendor};
