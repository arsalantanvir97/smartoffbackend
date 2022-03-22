import express from "express";
const router = express.Router();

import {
  Vendorlogs,
  toggleActiveStatus,
  getVendorDetails,
  registerVendor,
  authVendor,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  verifyAndREsetPassword,
  getCountofallCollection,
  allvendors
} from "../controllers/vendorController.js";
import { protect } from "../middlewares/authMiddleware";

router.post("/register", registerVendor);
router.post("/authVendor", authVendor);
router.post("/venderverifyRecoverCode", verifyRecoverCode);
router.post("/vendorRecoverPassword", recoverPassword);
router.post("/vendorresetPassword", resetPassword);
router.post("/editProfile", protect, editProfile);
router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);
router.get("/logs", protect, Vendorlogs);
router.get("/allvendors", protect, allvendors);

router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/vendor-details/:id", protect, getVendorDetails);
router.get("/getCountofallCollection", protect, getCountofallCollection);

export default router;
