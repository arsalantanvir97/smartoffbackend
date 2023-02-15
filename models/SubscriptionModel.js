import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema(
    {
      packagename: { type: String,},
      duration: { type: Number,},
      noofpagesscan: { type: Number,},
storagememory: { type: Number,},
noofpagesprint: { type: Number,},
internethours: { type: Number,},
      amount: { type: Number || String, },
      Features: { type: Array, },
      status: { type: String, },
    },
    {
      timestamps: true,
    }
  )
 

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;