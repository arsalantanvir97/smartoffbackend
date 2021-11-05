import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const AdManagementSchema = mongoose.Schema(
    {
      firstName: { type: String,},
      lastName: { type: String,},
      videoUri: { type: String, },
      status: { type: String,default:'Pending' },
      cost: { type: Number, },
      message: { type: String, },
      rejectreason: { type: String, },

expirydate:{ type: Date, },
      id: { type: String, },
    },
    {
      timestamps: true,
    }
  )
  AdManagementSchema.plugin(mongoosePaginate);
  AdManagementSchema.index({ "$**": "text" });

const Admanagement = mongoose.model("Admanagement", AdManagementSchema);

export default Admanagement;