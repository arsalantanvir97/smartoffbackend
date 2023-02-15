import express from "express";
const router = express.Router();

import {
    createhomepage,
} from "../controllers/homepageController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createhomepage", createhomepage);

export default router;
