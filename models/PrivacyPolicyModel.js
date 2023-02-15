import mongoose from "mongoose";

const PrivacyPolicySchema = mongoose.Schema(
  {

    details: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const PrivacyPolicy = mongoose.model("PrivacyPolicy", PrivacyPolicySchema);

export default PrivacyPolicy;
