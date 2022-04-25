import mongoose from "mongoose";

const SocialMediaSchema = mongoose.Schema(
  {
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
  
  },
  {
    timestamps: true
  }
);
const SocialMedia = mongoose.model("SocialMedia", SocialMediaSchema);

export default SocialMedia;
