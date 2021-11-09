import express from "express";
const router = express.Router();

import {
  getttingalltheNotification,
  getAllNotificationlogs,
  getSingleNotification,
} from "../controllers/notificationContoller";
import { protect } from "../middlewares/authMiddleware";

router.get("/getallNotification", protect, getttingalltheNotification);
// router.get("/getallNotification",getttingalltheNotification);

router.get("/notificationlogs", getAllNotificationlogs);
router.get("/singlenotification/:id", getSingleNotification);

export default router;
