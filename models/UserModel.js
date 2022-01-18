import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    totalPrints: { type: Number, default: 0 },
    userImage: { type: String },
    status: { type: Boolean, default: true },
    subscriptionid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },
    subscription: { type: Object }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.plugin(mongoosePaginate);
UserSchema.index({ "$**": "text" });

const User = mongoose.model("User", UserSchema);

export default User;
