import mongoose from 'mongoose'

const VerifySchema = mongoose.Schema(
    {
      
      email: {
        type: String,
        required: true,
        unique: true,
      },
      code: {
        type: String,
        required: true,
      },

    },
    {
      timestamps: true,
    }
  )
  const Verify = mongoose.model('Verify', VerifySchema)

  export default Verify