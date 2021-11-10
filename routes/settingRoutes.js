import express from "express";
const router = express.Router();
import { protect } from '../middlewares/authMiddleware'

import {
    createSetting,gettingsettings,updateSetting
} from "../controllers/settingController";
router.post("/createSetting",protect,createSetting);
router.get("/gettingsettings",protect,gettingsettings);
router.post("/updateSetting",protect,updateSetting);


export default router