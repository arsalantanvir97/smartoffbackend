import PrivacyPolicy from "../models/PrivacyPolicyModel";
import TermsCondition from "../models/TermsCondition";
import HowItWorks from "../models/HowItWorksModel";
import Question from "../models/QuestionModel";
import BecomeVendor from "../models/BecomeVendorModel";
import SocialMedia from "../models/SocialMediaModel";
import VideoSection from "../models/VideoSectionModel";

const createprivacyPolicy = async (req, res) => {
  const { details } = req.body;
  console.log("req.body", req.body);
  try {
    const privacyPolicy = new PrivacyPolicy({
      details
    });
    console.log("privacyPolicy", privacyPolicy);
    const privacyPolicycreated = await privacyPolicy.save();
    console.log("privacyPolicycreated", privacyPolicycreated);
    if (privacyPolicycreated) {
      res.status(201).json({
        privacyPolicycreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const createTermsCondition = async (req, res) => {
  const { details } = req.body;
  console.log("req.body", req.body);
  try {
    const termsCondition = new TermsCondition({
      details
    });
    console.log("termsCondition", termsCondition);
    const termsConditioncreated = await termsCondition.save();
    console.log("termsConditioncreated", termsConditioncreated);
    if (termsConditioncreated) {
      res.status(201).json({
        termsConditioncreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const createquestion = async (req, res) => {
  const { question } = req.body;
  console.log("req.body", req.body);
  try {
    const questions = new Question({
      question
    });
    console.log("questions", questions);
    const questionscreated = await questions.save();
    console.log("questionscreated", questionscreated);
    if (questionscreated) {
      res.status(201).json({
        questionscreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updatequestions = async (req, res) => {
  const { question } = req.body;

  try {
    const questions = await Question.findOne();
    questions.question = question;
    const updatedquestions = await questions.save();
    res.status(201).json({
      updatedquestions
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const createbecomevendor = async (req, res) => {
  const { text } = req.body;
  console.log("req.body", req.body);
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  try {
    const becomevendor = new BecomeVendor({
      text,
      image: user_image
    });
    console.log("becomevendor", becomevendor);
    const becomevendorcreated = await becomevendor.save();
    console.log("becomevendorcreated", becomevendorcreated);
    if (becomevendorcreated) {
      res.status(201).json({
        becomevendorcreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updatebecomevendor = async (req, res) => {
  const { text } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  try {
    const becomevendor = await BecomeVendor.findOne();
    becomevendor.text = text;
    becomevendor.image = user_image ? user_image : becomevendor.image;

    const updatedbecomevendor = await becomevendor.save();
    res.status(201).json({
      updatedbecomevendor
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const createvideosection = async (req, res) => {
  const { videouri } = req.body;

  try {
    const videosection = new VideoSection({
      videouri
    });
    console.log("videosection", videosection);
    const videosectioncreated = await videosection.save();
    console.log("videosectioncreated", videosectioncreated);
    if (videosectioncreated) {
      res.status(201).json({
        videosectioncreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updatevideosection = async (req, res) => {
  const { videouri } = req.body;

  try {
    const videosection = await VideoSection.findOne();
    videosection.videouri = videouri ? videouri : videosection.videouri;

    const updatedvideosectionn = await videosection.save();
    res.status(201).json({
      updatedvideosectionn
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const privacyPolicy = async (req, res) => {
  try {
    const privacypolicy = await PrivacyPolicy.findOne();
    res.status(201).json({
      privacypolicy
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const termsConditions = async (req, res) => {
  try {
    const termscondition = await TermsCondition.findOne();
    res.status(201).json({
      termscondition
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const howitworks = async (req, res) => {
  try {
    const howitworkss = await HowItWorks.findOne();
    res.status(201).json({
      howitworkss
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const question = async (req, res) => {
  try {
    const questions = await Question.findOne();
    res.status(201).json({
      questions
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const createsocialmedia = async (req, res) => {
  const { twitter, facebook, instagram } = req.body;
  console.log("req.body", req.body);
  try {
    const socialmedia = new SocialMedia({
      twitter,
      facebook,
      instagram
    });
    console.log("socialmedia", socialmedia);
    const socialmediacreated = await socialmedia.save();
    console.log("socialmediacreated", socialmediacreated);
    if (socialmediacreated) {
      res.status(201).json({
        socialmediacreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updatesocialmedia = async (req, res) => {
  const { twitter, facebook, instagram } = req.body;

  try {
    const socialmedia = await SocialMedia.findOne();
    socialmedia.twitter = twitter;
    socialmedia.facebook = facebook;
    socialmedia.instagram = instagram;

    const updatedsocialmedia = await socialmedia.save();
    res.status(201).json({
      updatedsocialmedia
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const becomevendor = async (req, res) => {
  try {
    const becomevendorr = await BecomeVendor.findOne();
    res.status(201).json({
      becomevendorr
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const socialmedia = async (req, res) => {
  try {
    const socialmediaa = await SocialMedia.findOne();
    res.status(201).json({
      socialmediaa
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const videosection = async (req, res) => {
  try {
    const videosectionn = await VideoSection.findOne();
    res.status(201).json({
      videosectionn
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getpolicyterms = async (req, res) => {
  try {
    const howitworkss = await HowItWorks.findOne();
    const privacypolicy = await PrivacyPolicy.findOne();
    const termscondition = await TermsCondition.findOne();
    const question = await Question.findOne();
    const becomevendor = await BecomeVendor.findOne();
    const socialmedia = await SocialMedia.findOne();
    const videosection = await VideoSection.findOne();

    res.status(201).json({
      howitworkss,
      privacypolicy,
      termscondition,
      question,
      becomevendor,
      socialmedia,
      videosection
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updatetermsConditions = async (req, res) => {
  const { text } = req.body;

  try {
   
    const termscondition = await TermsCondition.findOneAndUpdate(
      {},
      {
        details:text
      },
      { new: true, upsert: true, returnNewDocument: true }
    );
    
    await termscondition.save();
    res.status(201).json({
      updatedtermscondition:termscondition
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updateprivacyPolicy = async (req, res) => {
  const { text } = req.body;

  try {
    const privacypolicy = await PrivacyPolicy.findOne();
    privacypolicy.details = text;
    const updatedprivacypolicy = await privacypolicy.save();
    res.status(201).json({
      updatedprivacypolicy
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const createHowitworks = async (req, res) => {
  const { howitworks, signup, createprofile, launch } = req.body;
  console.log("req.body", req.body);
  try {
    const howitworkss = new HowItWorks({
      howitworks,
      signup,
      createprofile,
      launch
    });
    const howitworksscreated = await howitworkss.save();
    console.log("howitworksscreated", howitworksscreated);
    if (howitworksscreated) {
      res.status(201).json({
        howitworksscreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updateHowitworks = async (req, res) => {
  const { howitworks, signup, createprofile, launch } = req.body;

  try {
    const howitworkss = await HowItWorks.findOne();
    console.log("howitworkss", howitworkss);
    howitworkss.howitworks = howitworks;
    howitworkss.signup = signup;
    howitworkss.createprofile = createprofile;
    howitworkss.launch = launch;

    const updatedhowitworkss = await howitworkss.save();
    res.status(201).json({
      updatedhowitworkss
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
export {
  createprivacyPolicy,
  createTermsCondition,
  privacyPolicy,
  termsConditions,
  updatetermsConditions,
  updateprivacyPolicy,
  createHowitworks,
  updateHowitworks,
  howitworks,
  getpolicyterms,
  createquestion,
  updatequestions,
  question,
  createbecomevendor,
  updatebecomevendor,
  becomevendor,
  createsocialmedia,
  updatesocialmedia,
  socialmedia,
  createvideosection,
  updatevideosection,
  videosection
};
