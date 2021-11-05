import express from "express";
const router = express.Router();

import {
    createSetting,gettingsettings,updateSetting
} from "../controllers/settingController";
router.post("/createSetting",createSetting);
router.get("/gettingsettings",gettingsettings);
router.post("/updateSetting",updateSetting);


export default router