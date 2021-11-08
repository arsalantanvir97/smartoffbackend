import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const PrintSchema = mongoose.Schema(
  {
    vendorid: { type: String },
    printid: { type: String },
    printerid: { type: String },
    documentname: { type: String },
    pages: { type: Number },
    costperpage: { type: Number },
    printlocation: { type: [Number] },
    type: { type: String },
    totalcost: { type: Number },
    userid: { type: String },
    adminComission: { type: Number },

    userName: { type: String },
  },
  {
    timestamps: true,
  }
);
PrintSchema.plugin(mongoosePaginate);
PrintSchema.index({ "$**": "text" });

const Print = mongoose.model(" Print", PrintSchema);

export default Print;
