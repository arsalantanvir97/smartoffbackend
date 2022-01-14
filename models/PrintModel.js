import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const PrintSchema = mongoose.Schema(
  {
    vendorid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor"
    },
   
    documentname: { type: String },
    pages: { type: Number },
    costperpage: { type: Number },
    type: { type: String },
    totalcost: { type: Number },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    adminComission: { type: Number },
    requestformachine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestMachine"
    },
    userName: { type: String },
    paid:{type:Boolean,default:false},
    paidDate:{type:Date},
    status:{type:Boolean,default:true},

  },
  {
    timestamps: true
  }
);
PrintSchema.plugin(mongoosePaginate);
PrintSchema.index({ "$**": "text" });

const Print = mongoose.model(" Print", PrintSchema);

export default Print;
