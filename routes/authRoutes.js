import express from "express";
const router = express.Router();
import {
  authAdmin,
  registerAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  registerUser,
  registerVendor
} from "../controllers/authController.js";

router.post("/adminRegister", registerAdmin);
router.post("/adminAuth", authAdmin);
router.post("/adminRecoverPassword", recoverPassword);
router.post("/adminverifyRecoverCode", verifyRecoverCode);
router.post("/adminresetPassword", resetPassword);
router.post("/editProfile", editProfile);
router.post("/registerUser", registerUser);
router.post("/registerVendor", registerVendor);


export default router;
