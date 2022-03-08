import mongoose from "mongoose";

const UserGuideSchema = mongoose.Schema(
  {
    image: {
      type: String
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
const UserGuide = mongoose.model("UserGuide", UserGuideSchema);

export default UserGuide;
