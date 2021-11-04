import express from "express";
const router = express.Router();

import {
    createRequestMachine,RequestMachinelogs,getRequestMachineDetails
} from "../controllers/requestmachineController";

router.post("/create-RequestMachine",createRequestMachine);
router.get("/RequestMachinelogs",RequestMachinelogs);
router.get("/RequestMachine-details/:id",getRequestMachineDetails);


export default router;