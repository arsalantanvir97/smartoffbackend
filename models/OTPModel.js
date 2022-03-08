import mongoose from "mongoose";

const OTPSchema = mongoose.Schema(
  {
    country_code: {
      type: String,
      required: true,
      unique: true
    },
    mobile_number: {
      type: String,
      required: true,
      unique: true
    },
    code: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;
