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
  registerVendor,
  verifyAndREsetPassword
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware";

router.post("/adminRegister", registerAdmin);
router.post("/adminAuth", authAdmin);
router.post("/adminRecoverPassword", recoverPassword);
router.post("/adminverifyRecoverCode", verifyRecoverCode);
router.post("/adminresetPassword", resetPassword);
router.post("/editProfile",protect, editProfile);
router.post("/registerUser", registerUser);
router.post("/registerVendor", registerVendor);
router.post("/verifyAndREsetPassword", verifyAndREsetPassword);



export default router;
