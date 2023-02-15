import UserGuide from "../models/UserGuideModel";
import moment from "moment";

const createUserGuide = async (req, res) => {
  const { description } = req.body;
  console.log("req.body", req.body);
  try {
    let user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    console.log("user_image", user_image);
    const userguide = new UserGuide({
      image: user_image,
      description
    });
    console.log("userguide", userguide);

    const userguidecreated = await userguide.save();
    console.log("userguidecreated", userguidecreated);
    if (userguidecreated) {
      res.status(201).json({
        userguidecreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getallUserGuide = async (req, res) => {
  try {
    const steps = await UserGuide.find();

    await res.status(201).json({
        steps
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createUserGuide, getallUserGuide };
