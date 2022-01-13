import AdmanagementModel from "../models/AdmanagementModel";

const ExpiryDate = async () => {
  try {
    var now = new Date();
    // Set the date 14 days in the past
    now = new Date(now.setDate(now.getDate() - 30));
    const adManagement = await AdmanagementModel.updateMany(
      { createdAt: { $lte: now } },
      { $set: { expirydate: true ,status:'Expired'} },
      { multi: true }
    ).exec();
    console.log('ExpiryDate')
  } catch (err) {
    console.log("err in ExpiryDate: ", err);
    return true;
  }
};

export default ExpiryDate;
