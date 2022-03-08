import express from "express";
const router = express.Router();
import { protect } from "../middlewares/authMiddleware";

import {
  createSubscription,
  allOfSubscription,
  getSingleSubscription,
  updateSubscription,
  subscriptionPayment
} from "../controllers/subscriptionController";

router.post("/createSubscription", protect, createSubscription);
router.get("/allsubscription", protect, allOfSubscription);
router.get("/getSingleSubscription/:id", protect, getSingleSubscription);
router.post("/updateSubscription", protect, updateSubscription);
router.post("/subscriptionPayment",protect, subscriptionPayment);

export default router;
