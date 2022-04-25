import mongoose from "mongoose";

const HowItWorksSchema = mongoose.Schema(
  {
    howitworks: {
      type: String
    },
    signup: {
      type: String
    },
    createprofile: {
      type: String
    },
    launch: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
const HowItWorks = mongoose.model("HowItWorks", HowItWorksSchema);

export default HowItWorks;
