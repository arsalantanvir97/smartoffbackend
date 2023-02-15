import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const BranchSchema = mongoose.Schema(
    {
      branchName: { type: String,},
      country: { type: String, },
      city: { type: String, },
      zipcode: { type: Number, },
      address: { type: String, },

      vendorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
      },  
     geolocation:{type:[Number]}

    },
    {
      timestamps: true,
    }
  )
  BranchSchema.plugin(mongoosePaginate);
  BranchSchema.index({ "$**": "text" });

const Branch = mongoose.model("Branch", BranchSchema);

export default Branch;