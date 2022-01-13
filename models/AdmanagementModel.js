import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const AdManagementSchema = mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    videoUri: { type: String },
    status: { type: String, default: "Pending" },
    cost: { type: Number },
    message: { type: String },
    rejectreason: { type: String },
    link: { type: String },
    expirydate: {type:  Boolean },
    paid: {type:  Boolean ,default:false},
paymentDetails:{type:Object},
    vendorid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor"
    },
    createdAt: { type: Date, expires: '2m', default: Date.now }

  },

);
AdManagementSchema.plugin(mongoosePaginate);
AdManagementSchema.index({ "$**": "text" });

const Admanagement = mongoose.model("Admanagement", AdManagementSchema);

export default Admanagement;
