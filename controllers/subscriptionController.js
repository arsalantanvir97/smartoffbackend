import Subscription from "../models/SubscriptionModel.js";
import moment from "moment";

const createSubscription  = async (req, res) => {
    const { packagename,duration, amount,Features,status } = req.body;
console.log('req.body',req.body)
    try {
      const subscription =new Subscription ({
        packagename,duration, amount,Features,status}
      )
      console.log('subscription',subscription)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const allOfSubscriptions=await subscription.save()
    console.log('allOfSubscriptions',allOfSubscriptions)
      if (allOfSubscriptions) {
        res.status(201).json({
            allOfSubscriptions
        });
    } }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const allOfSubscription  = async (req, res) => {
  
    try {
        const getAllSubscriptions=await Subscription.find()
        console.log('getAllSubscriptions',getAllSubscriptions)
        if (getAllSubscriptions) {
         res.status(201).json({
             getAllSubscriptions
         });}
      }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };

  const getSingleSubscription = async (req, res) => {
    try {
      const subscription = await Subscription.findById(req.params.id)
      await res.status(201).json({
        subscription,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };

  const updateSubscription = (async (req, res) => {
    const {
        id,
        packagename,
        duration,
        cost,
        status,
    } = req.body
  console.log('req.body',req.body)
    const subscription = await Subscription.findByIdAndUpdate({_id:id}, { packagename: packagename, duration: duration,amount:cost,status:status }, { new: true });
 
    if (subscription) {
      res.json(subscription)
    } else {
      res.status(404)
      throw new Error('subscription not found')
    }
  })

  export { createSubscription,allOfSubscription,getSingleSubscription,updateSubscription}
