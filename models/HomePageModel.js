import mongoose from "mongoose";

const HomePageSchema = mongoose.Schema(
  {
    videourl: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const HomePage = mongoose.model("HomePage", HomePageSchema);

export default HomePage;
