import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";


const VendorSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone:{
        type: String || Number,
      },
    address:{
        type: String,
      },
      organizationName:{
        type: String,
      },printerLocation:{
        type: Array,
      },
          userImage: { type: String },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

VendorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

VendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

VendorSchema.plugin(mongoosePaginate);
VendorSchema.index({ "$**": "text" });

const Vendor = mongoose.model("Vendor", VendorSchema);

export default Vendor;
