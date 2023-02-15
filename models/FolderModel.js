import mongoose from "mongoose";

const FolderSchema = mongoose.Schema(
  {folderName:{type:String},
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileArr: { type: Array },
   
  },
  {
    timestamps: true
  }
);

const Folder = mongoose.model("Folder", FolderSchema);

export default Folder;
