import express from "express";
const router = express.Router();

import {
  createUserGuide,
  getallUserGuide
} from "../controllers/userGuideController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createUserGuide", protect,createUserGuide);
router.get("/userGuide", protect,getallUserGuide);

export default router;
