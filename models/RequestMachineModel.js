import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const RequestMachineSchema = mongoose.Schema(
    {
      firstName: { type: String,},
      lastName: { type: String,},
      organizationName: { type: String, },
      numberOfMachineReq: { type: Number, },
      organizationAddress: { type: String, },
      branchName: { type: String, },
      branchAddress: { type: String, },
      Message: { type: String, },

      id: { type: String, },
    },
    {
      timestamps: true,
    }
  )
  RequestMachineSchema.plugin(mongoosePaginate);
  RequestMachineSchema.index({ "$**": "text" });

const RequestMachine = mongoose.model("RequestMachine", RequestMachineSchema);

export default RequestMachine;