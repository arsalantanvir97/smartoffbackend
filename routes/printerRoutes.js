import express from "express";
const router = express.Router();

import {
    createPrinter
} from "../controllers/printerController";

router.post("/create-Printer",createPrinter);


export default router;