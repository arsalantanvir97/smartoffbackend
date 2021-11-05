import mongoose from 'mongoose'

const SettingSchema = mongoose.Schema(
    {
      
        costforcolor: {
        type: Number,
      
      },
      costforblackandwhite: {
        type: Number,
      
      },
     
    comissonsetting:{
        type: Number,

    }
    },
    {
      timestamps: true,
    }
  )
  const Setting = mongoose.model('Setting', SettingSchema)

  export default Setting