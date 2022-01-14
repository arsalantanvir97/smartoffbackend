import express from "express";
const router = express.Router();

import {
  getttingalltheNotification,
  getAllNotificationlogs,
  getSingleNotification,
  markallNotificationasRead,
  vendorNotificationLogs
} from "../controllers/notificationContoller";
import { protect } from "../middlewares/authMiddleware";

router.get("/getallNotification", protect, getttingalltheNotification);
// router.get("/getallNotification",getttingalltheNotification);

router.get("/notificationlogs",protect,getAllNotificationlogs);
router.get("/vendorNotificationLogs",protect,vendorNotificationLogs);

router.get("/singlenotification/:id", protect,getSingleNotification);
router.get("/markallNotificationasRead",protect, markallNotificationasRead);


export default router;
