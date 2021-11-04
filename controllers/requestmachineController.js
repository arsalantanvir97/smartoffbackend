import RequestMachine from "../models/RequestMachineModel";
import moment from "moment";

const createRequestMachine = async (req, res) => {
    const { id,firstName, lastName,organizationName,numberOfMachineReq,organizationAddress,branchName,branchAddress,Message } = req.body;
console.log('req.body',req.body)
    try {
      const requestmachine =new RequestMachine ({
        firstName,
        lastName,
        organizationName,
        numberOfMachineReq,
        organizationAddress,
        branchName,
        branchAddress,
        Message,
        id,}
      )
      console.log('requestmachine',requestmachine)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const requestmachinecreated=await requestmachine.save()
    console.log('requestmachinecreated',requestmachinecreated)
      if (requestmachinecreated) {
        res.status(201).json({
            requestmachinecreated
        });
    } }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const RequestMachinelogs = async (req, res) => {
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
  
      const requestmachine = await RequestMachine.paginate(
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
        requestmachine,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const getRequestMachineDetails = async (req, res) => {
    try {
      const requestmachine = await RequestMachine.findById(req.params.id).lean().select("-password");
      await res.status(201).json({
        requestmachine,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };


  export {createRequestMachine,RequestMachinelogs,getRequestMachineDetails};

