import express from "express";
const router = express.Router();

import {
  createUserGuide,
  getallUserGuide
} from "../controllers/userGuideController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createUserGuide", createUserGuide);
router.get("/userGuide", getallUserGuide);

export default router;
