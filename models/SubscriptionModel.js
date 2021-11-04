import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema(
    {
      packagename: { type: String,},
      duration: { type: String,},
      amount: { type: Number, },
      Features: { type: Array, },
      status: { type: String, },
    },
    {
      timestamps: true,
    }
  )
 

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;