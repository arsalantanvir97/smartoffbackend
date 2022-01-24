import express from "express";
const router = express.Router();

import {
  logs,
  toggleActiveStatus,
  getUserDetails,
  getLatestUsers,
  getCountofallCollection,
  registerUser,
  authUser,
  verifyRecoverCode,
  recoverPassword,
  resetPassword,
  editProfile,
  verifyAndREsetPassword,
  paymentOfSubscription,
  getUserDetailsandCheckSubscrptionExpiry
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware";
router.post("/register", registerUser);
router.post("/authUser", authUser);
router.post("/userverifyRecoverCode", verifyRecoverCode);
router.post("/userRecoverPassword", recoverPassword);
router.post("/userresetPassword", resetPassword);
router.post("/editProfile", protect, editProfile);
router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);
router.get("/logs", protect, logs);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/user-details/:id", protect, getUserDetails);
router.get("/getlatestusers", protect, getLatestUsers);
router.get("/getCountofallCollection", protect, getCountofallCollection);
router.post("/paymentOfSubscription", protect, paymentOfSubscription);
router.get("/getUserDetailsandCheckSubscrptionExpiry/:id", protect, getUserDetailsandCheckSubscrptionExpiry);


export default router;
