// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import mongoosePaginate from "mongoose-paginate-v2";

// const AdManagementSchema = mongoose.Schema(
//     {
//       printid: { type: String,},
//       printerid: { type: String,},
//       documentname: { type: String, },
//       pages: { type: Number, },
//       costperpage: { type: Number, },
//       printlocation: { type: String, },
//       type: { type: String, },
// totalcost:{type: Number, },
// userid:{type: String},
// userName:{type: String},
//     },
//     {
//       timestamps: true,
//     }
//   )
//   AdManagementSchema.plugin(mongoosePaginate);
//   AdManagementSchema.index({ "$**": "text" });

// const Admanagement = mongoose.model("Admanagement", AdManagementSchema);

// export default Admanagement;