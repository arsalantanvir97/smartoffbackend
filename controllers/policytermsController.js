import PrivacyPolicy from "../models/PrivacyPolicyModel";
import TermsCondition from "../models/TermsCondition";
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

const privacyPolicy = async (req, res) => {
    
    try {
    const privacypolicy=await PrivacyPolicy.findOne()
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
    const termscondition=await TermsCondition.findOne()
        res.status(201).json({
            termscondition
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
    const termscondition=await TermsCondition.findOne()
    termscondition.details=text
   const updatedtermscondition= await termscondition.save()
        res.status(201).json({
          updatedtermscondition
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
    const privacypolicy=await PrivacyPolicy.findOne()
    privacypolicy.details=text
   const updatedprivacypolicy= await privacypolicy.save()
        res.status(201).json({
          updatedprivacypolicy
        });
      
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  
export { createprivacyPolicy, createTermsCondition,privacyPolicy,termsConditions,updatetermsConditions,updateprivacyPolicy };
