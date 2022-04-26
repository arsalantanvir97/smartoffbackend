import mongoose from "mongoose";

const ServicesSchema = mongoose.Schema(
  {

    details: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const Services = mongoose.model("Services", ServicesSchema);

export default Services;
