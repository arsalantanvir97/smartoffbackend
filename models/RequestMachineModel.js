import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const RequestMachineSchema = mongoose.Schema(
  {
    organizationName: { type: String },
    numberOfMachineReq: { type: Number },
    branchid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch"
    },
    Message: { type: String },
    vendorid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor"
    },
    idofvendor: {
      type: String
    },
    status: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);
RequestMachineSchema.plugin(mongoosePaginate);
RequestMachineSchema.index({ "$**": "text" });

const RequestMachine = mongoose.model("RequestMachine", RequestMachineSchema);

export default RequestMachine;
