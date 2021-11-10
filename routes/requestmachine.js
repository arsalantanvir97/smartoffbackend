import express from "express";
const router = express.Router();

import {
    createRequestMachine,RequestMachinelogs,getRequestMachineDetails
} from "../controllers/requestmachineController";
import { protect } from '../middlewares/authMiddleware'

router.post("/create-RequestMachine",protect,createRequestMachine);
router.get("/RequestMachinelogs",protect,RequestMachinelogs);
router.get("/RequestMachine-details/:id",protect,getRequestMachineDetails);


export default router;