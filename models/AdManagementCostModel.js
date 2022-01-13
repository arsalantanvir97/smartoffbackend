import mongoose from 'mongoose'

const AdManagementCostSchema = mongoose.Schema(
    {
      
        cost: {
        type: Number,
      
      },
     
    },
    {
      timestamps: true,
    }
  )
  const AdManagementCost = mongoose.model('AdManagementCost', AdManagementCostSchema)

  export default AdManagementCost