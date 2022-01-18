import mongoose from "mongoose";

const FileSchema = mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    docfile: { type: String },
  },
  {
    timestamps: true
  }
);

const File = mongoose.model("File", FileSchema);

export default File;
