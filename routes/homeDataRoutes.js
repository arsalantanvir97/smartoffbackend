import express from "express";
const router = express.Router();

import {
    createhomeData,allofHomedataandhomePage
} from "../controllers/homeDataController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createhomeData", createhomeData);
router.get("/homeData", allofHomedataandhomePage);

export default router;
