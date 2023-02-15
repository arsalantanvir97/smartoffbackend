import express from "express";
const router = express.Router();

import {
  createAdmanagement,
  Admanagementlogs,
  getAdmanagementDetails,
  setCostforAd,
  rejectAd,
  approveAd,
  deleteAd,
  paymentofAd,
  updatestatus,
  getAdManagementCost,
  vendoradmanagementlogs
} from "../controllers/admanagementcontroller";
import { protect } from "../middlewares/authMiddleware";

router.post("/create-admanagement", protect, createAdmanagement);
router.get("/admanagementlogs", protect, Admanagementlogs);
router.get("/vendoradmanagementlogs", protect, vendoradmanagementlogs);

router.get("/admanagement-details/:id", protect, getAdmanagementDetails);
router.post("/settingCostforAd", protect, setCostforAd);
router.post("/rejectAd", protect, rejectAd);
router.post("/approveAd", protect, approveAd);
router.get("/deleteAd/:id", protect, deleteAd);
router.post("/paymentofAd", protect, paymentofAd);
router.post("/updatestatus", protect, updatestatus);
router.get("/getAdManagementCost", protect, getAdManagementCost);

export default router;
