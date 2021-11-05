import AdmanagementModel from "../models/AdmanagementModel";
import moment from "moment";

const createAdmanagement= async (req, res) => {
    const { id,firstName, lastName,message } = req.body;
console.log('req.body',req.files)
let videoUri =
req.files &&
req.files.ad_video &&
req.files.ad_video[0] &&
req.files.ad_video[0].path;
    try {
      const admanagement =new AdmanagementModel ({
        firstName,
        lastName,
        message,
        videoUri ,
        id,}
      )
      console.log('feedback',admanagement)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const admanagementcreated=await admanagement.save()
    console.log('admanagementcreated',admanagementcreated)
      if (admanagementcreated) {
        res.status(201).json({
            admanagementcreated
        });
    } }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const Admanagementlogs = async (req, res) => {
    try {
      console.log('req.query.searchString',req.query.searchString)
      const searchParam = req.query.searchString
        ? { $text: { $search: req.query.searchString } }
        : {};
      const status_filter = req.query.status ? { status: req.query.status } : {};
      const from = req.query.from ;
      const to = req.query.to;
      let dateFilter = {};
      if (from && to)
        dateFilter = {
          createdAt: {
            $gte: moment.utc(new Date(from)).startOf("day"),
            $lte: moment.utc(new Date(to)).endOf("day"),
          },
        };
  
      const admanagement = await AdmanagementModel.paginate(
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
        admanagement,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const getAdmanagementDetails = async (req, res) => {
    try {
      const admanagement = await AdmanagementModel.findById(req.params.id)
      await res.status(201).json({
        admanagement,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const setCostforAd = async (req, res) => {
    console.log('req',req.body.cost,typeof(req.body.cost))
    console.log('api hit1')

    try {
      console.log('api hit2')
      const admanagement=await AdmanagementModel.updateMany({}, {$set:{"cost": Number(req.body.cost)}})
      
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
 const rejectAd = async (req, res) => {
  const { id,rejectreason } = req.body;

    try {
      const rejectad = await AdmanagementModel.findByIdAndUpdate({_id:id}, { rejectreason: rejectreason, status:'Rejected' }, { new: true, upsert: true }).exec();;

      await res.status(201).json({
        rejectad,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const approveAd = async (req, res) => {
    const { id } = req.body;
  
      try {
        const approvead = await AdmanagementModel.findByIdAndUpdate({_id:id}, {  status:'Approved' }, { new: true, upsert: true }).exec();;
  
        await res.status(201).json({
          approvead,
        });
      } catch (err) {
        res.status(500).json({
          message: err.toString(),
        });
      }
    };

  export {createAdmanagement,Admanagementlogs,getAdmanagementDetails,setCostforAd,rejectAd,approveAd};

