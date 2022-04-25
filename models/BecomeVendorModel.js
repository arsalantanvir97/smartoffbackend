import mongoose from "mongoose";

const BecomeVendorSchema = mongoose.Schema(
  {
    text: {
      type: String
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
const BecomeVendor = mongoose.model("BecomeVendor", BecomeVendorSchema);

export default BecomeVendor;
