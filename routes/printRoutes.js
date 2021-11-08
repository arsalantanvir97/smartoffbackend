import express from "express";
const router = express.Router();

import {
  createPrint,
  Printlogs,
  getPrintDetails,
  getAllPrintlogs,
  getVendorPrintlogs,
} from "../controllers/printController";

router.post("/create-Print", createPrint);
router.get("/Printlogs/:id", Printlogs);
router.get("/getallPrintLogs", getAllPrintlogs);
router.get("/getVendorPrintlogs/:id", getVendorPrintlogs);

router.get("/print-details/:id", getPrintDetails);

export default router;
