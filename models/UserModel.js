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
      unique: true
    },
    password: {
      type: String,
    },
    totalPrints: { type: Number, default: 0 },
    userImage: { type: String },
    expiryDate: { type: Date },
    paymentResult: { type: Object },
    status: { type: Boolean, default: true },
    subscriptionid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },
    subscription: { type: Object ,default:null},
    is_recurring:{type:Boolean},
    mobile_number: { type: String,unique:true },
    country_code: { type: String },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"] // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
      }
    },
    googleId: {
      type: String
    },
    facebookId: {
      type: String
    },
    appleId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);
UserSchema.index({ location: "2dsphere" });
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
