import express from "express";
import { privacyPolicy, termsConditions } from "../controllers/policytermsController.js";
import { getServices } from "../controllers/servicesController.js";
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
  getUserDetailsandCheckSubscrptionExpiry,
  login,
  Singup,
  forgotPassword,
  verifyCode,
  SocialLogin,
  updatePassword,
  updateProfile,
  cancelationOfSubscription,
  dataforprinting,
  loginVerifyCode,
  deleteuser
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
router.get(
  "/getUserDetailsandCheckSubscrptionExpiry/:id",
  protect,
  getUserDetailsandCheckSubscrptionExpiry
);
router.post("/login", login);
router.post("/singup", Singup);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyCode", verifyCode);
router.post("/SocialLogin", SocialLogin);
router.post("/updatePassword", updatePassword);
router.post("/updateProfile",protect, updateProfile);
router.post("/cancelationOfSubscription", protect,cancelationOfSubscription);
router.get("/getServices", getServices);
router.get("/privacyPolicy", privacyPolicy);
router.get("/termsConditions", termsConditions);
router.get('/dataforprinting',protect,dataforprinting)
router.post('/loginVerifyCode',loginVerifyCode)
router.get('/deleteuser',protect,deleteuser)


export default router;
