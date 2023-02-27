import mongoose from "mongoose";

const VendorSubscriptionSchema = mongoose.Schema(
    {
        packagename: { type: String, },
        duration: { type: Number, },

        amount: { type: Number || String, },

    },
    {
        timestamps: true,
    }
)


const VendorSubscription = mongoose.model("VendorSubscription", VendorSubscriptionSchema);

export default VendorSubscription;