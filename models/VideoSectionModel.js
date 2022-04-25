import mongoose from "mongoose";

const VideoSectionSchema = mongoose.Schema(
  {
    videouri: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const VideoSection = mongoose.model("VideoSection", VideoSectionSchema);

export default VideoSection;
