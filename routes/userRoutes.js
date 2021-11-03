import express from "express";
const router = express.Router();

import {
    logs
} from "../controllers/userController.js";

router.get("/logs", logs);

export default router;
