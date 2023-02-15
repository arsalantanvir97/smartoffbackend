import express from "express";
const router = express.Router();

import {
    createPrinter
} from "../controllers/printerController";
import { protect } from '../middlewares/authMiddleware'

router.post("/create-Printer",protect,createPrinter);


export default router;