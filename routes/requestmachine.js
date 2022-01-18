import express from "express";
const router = express.Router();

import {
    createRequestMachine,RequestMachinelogs,getRequestMachineDetails,getRequestMachinebyVendorid,getRequestMachine
} from "../controllers/requestmachineController";
import { protect } from '../middlewares/authMiddleware'

router.post("/create-RequestMachine",protect,createRequestMachine);
router.get("/RequestMachinelogs",protect,RequestMachinelogs);
router.get("/RequestMachine-details/:id",protect,getRequestMachineDetails);
router.post("/getRequestMachinebyVendorid",protect,getRequestMachinebyVendorid);
router.get("/getRequestMachine",protect,getRequestMachine);


export default router;