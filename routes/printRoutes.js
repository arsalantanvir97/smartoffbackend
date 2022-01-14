import express from "express";
const router = express.Router();

import {
  createPrint,
  Printlogs,
  getPrintDetails,
  getAllPrintlogs,
  getVendorPrintlogs,
  paidStatusVendorPrintlogs,
  getLatestPrintsofVendor
} from "../controllers/printController";
import { protect } from "../middlewares/authMiddleware";

router.post("/create-Print", protect, createPrint);
router.get("/Printlogs/:id", protect, Printlogs);
router.get("/getallPrintLogs", protect, getAllPrintlogs);
router.get("/getVendorPrintlogs/:id", protect, getVendorPrintlogs);
router.get(
  "/paidStatusVendorPrintlogs/:id",
  protect,
  paidStatusVendorPrintlogs
);
router.get("/print-details/:id", protect, getPrintDetails);
router.get("/getLatestPrintsofVendor/:id", protect, getLatestPrintsofVendor);

export default router;
