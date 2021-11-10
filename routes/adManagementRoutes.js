import express from "express";
const router = express.Router();

import {
    createAdmanagement,Admanagementlogs,getAdmanagementDetails,setCostforAd,rejectAd,approveAd
} from "../controllers/admanagementcontroller";
import { protect } from "../middlewares/authMiddleware";

router.post("/create-admanagement",protect,createAdmanagement);
router.get("/admanagementlogs",protect,Admanagementlogs);
router.get("/admanagement-details/:id",protect,getAdmanagementDetails);
router.post("/settingCostforAd",protect,setCostforAd);
router.post("/rejectAd",protect,rejectAd);
router.post("/approveAd",protect,approveAd);



export default router;