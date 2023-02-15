import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const HomeDataSchema = mongoose.Schema(
  {
    banner: {
      type: String
    },
    title: {
        type: String
      },
      price: {
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
HomeDataSchema.plugin(mongoosePaginate);
HomeDataSchema.index({ "$**": "text" });

const HomeData = mongoose.model("HomeData", HomeDataSchema);

export default HomeData;
