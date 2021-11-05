import Setting from "../models/SettingsModel.js";
const createSetting  = async (req, res) => {
    const { costforcolor,costforblackandwhite,comissonsetting } = req.body;
console.log('req.body',req.body)
    try {
      const setting =new Setting ({
        costforcolor,costforblackandwhite,comissonsetting}
      )
      console.log('setting',setting)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const createdsetting=await setting.save()
    console.log('createdsetting',createdsetting)
      if (createdsetting) {
        res.status(201).json({
            createdsetting
        });
    } }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const gettingsettings  = async (req, res) => {
  
    try {
        const setting=await Setting.findOne()
        console.log('setting',setting)
        if (setting) {
         res.status(201).json({
            setting
         });}
      }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };

  const updateSetting = (async (req, res) => {
    const {
        id,
    
        costforblackandwhite,
        costforcolor,
        comissonsetting,
    } = req.body
  console.log('req.body',req.body)
    const setting = await Setting.findByIdAndUpdate({_id:id}, { costforblackandwhite: costforblackandwhite, costforcolor: costforcolor,comissonsetting:comissonsetting }, { new: true });
 
    if (setting) {
      res.json(setting)
    } else {
      res.status(404)
      throw new Error('setting not found')
    }
  })

  export { createSetting,gettingsettings,updateSetting}
