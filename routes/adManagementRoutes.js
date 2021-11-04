import express from "express";
const router = express.Router();

import {
    createAdmanagement,Admanagementlogs,getAdmanagementDetails
} from "../controllers/admanagementcontroller";

router.post("/create-admanagement",createAdmanagement);
router.get("/admanagementlogs",Admanagementlogs);
router.get("/admanagement-details/:id",getAdmanagementDetails);


export default router;