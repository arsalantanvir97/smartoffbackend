import homeData from "../models/homeDataModel";
import HomePage from "../models/HomePageModel";

import moment from "moment";

const createhomeData = async (req, res) => {
  const { title, price, description } = req.body;

  console.log("req.body", req.body);
  try {
    let user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;

    console.log("user_image", user_image);

    const homedata = new homeData({
      banner: user_image,
      title,
      price,
      description
    });
    console.log("homedata", homedata);

    const homedatacreated = await homedata.save();
    console.log("homedatacreated", homedatacreated);
    if (homedatacreated) {
      res.status(201).json({
        homedatacreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const allofHomedataandhomePage = async (req, res) => {
  console.log("PringetVendorPrintlogstlogs", req.query);
  try {
    console.log("req.query.searchString", req.query.search);
    const searchParam = req.query.search
      ? // { $text: { $search: req.query.search } }
        {
          $or: [
            {
              title: { $regex: `${req.query.search}`, $options: "i" }
            },
            {
              description: {
                $regex: `${req.query.search}`,
                $options: "i"
              }
            }
          ]
        }
      : {};

    const homepage = await HomePage.find();
    const homedata = await homeData.paginate(
      {
        ...searchParam
      },
      {
        lean: true,
        sort: "-_id"
      }
    );
    await res.status(200).json({
      services: homedata,
      videos: homepage
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
export { createhomeData, allofHomedataandhomePage };
