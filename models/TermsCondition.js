import mongoose from "mongoose";

const TermsConditionSchema = mongoose.Schema(
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
const TermsCondition = mongoose.model("TermsCondition", TermsConditionSchema);

export default TermsCondition;
