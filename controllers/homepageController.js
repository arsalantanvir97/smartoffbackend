import HomePage from "../models/HomePageModel";
import moment from "moment";

const createhomepage = async (req, res) => {
  console.log("req.body", req.body);
  try {
    let user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    let videoUri =
      req.files &&
      req.files.ad_video &&
      req.files.ad_video[0] &&
      req.files.ad_video[0].path;
    console.log("user_image", user_image);
    const homepage = new HomePage({
      thumbnail: user_image,
      videourl: videoUri
    });
    console.log("homepage", homepage);

    const homepagecreated = await homepage.save();
    console.log("homepagecreated", homepagecreated);
    if (homepagecreated) {
      res.status(201).json({
        homepagecreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createhomepage };
