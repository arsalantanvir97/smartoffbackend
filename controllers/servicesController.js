import Services from "../models/ServicesModel";
const createServices = async (req, res) => {
  const { text } = req.body;
  let image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;

  console.log("req.body", req.body);
  try {
    const services = new Services({
      details: text,
      image
    });
    console.log("services", services);
    const servicescreated = await services.save();
    console.log("servicescreated", servicescreated);
    if (servicescreated) {
      res.status(201).json({
        servicescreated
      });
    }
  } catch (err) {
    console.log('error',err)
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Services.find();
    res.status(201).json({
      services
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const singleService = async (req, res) => {
  try {
    const services = await Services.findOne({ _id: req.params.id });
    res.status(201).json({
      services
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updateServices = async (req, res) => {
  const { text, id } = req.body;
  let image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  try {
    const services = await Services.findOne({ _id: id });

    services.details = text;
    services.image = image ? image : services.image;

    const updatedservices = await services.save();
    res.status(201).json({
      updatedservices
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createServices, singleService, getServices, updateServices };
