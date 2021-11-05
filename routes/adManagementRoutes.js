import express from "express";
const router = express.Router();

import {
    createAdmanagement,Admanagementlogs,getAdmanagementDetails,setCostforAd,rejectAd,approveAd
} from "../controllers/admanagementcontroller";

router.post("/create-admanagement",createAdmanagement);
router.get("/admanagementlogs",Admanagementlogs);
router.get("/admanagement-details/:id",getAdmanagementDetails);
router.post("/settingCostforAd",setCostforAd);
router.post("/rejectAd",rejectAd);
router.post("/approveAd",approveAd);



export default router;