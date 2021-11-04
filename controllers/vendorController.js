import Vendor from "../models/VendorModel.js";

import moment from "moment";

const Vendorlogs = async (req, res) => {
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
  
      const vendors = await Vendor.paginate(
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
        vendors,
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
      const vendor = await Vendor.findById(req.params.id);
      console.log('vendor',vendor)
      vendor.status = vendor.status == true ? false : true;
      console.log('vendor1',vendor)

      await vendor.save();
      console.log('vendor2')

      await res.status(201).json({
        message: vendor.status ? "Vendor Activated" : "Vendor Deactivated",
      });
    } catch (err) {
        console.log('error',err)

      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const getVendorDetails = async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id).lean().select("-password");
      await res.status(201).json({
        vendor,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  
  export { Vendorlogs ,toggleActiveStatus,getVendorDetails,};
