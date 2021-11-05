import express from "express";
const router = express.Router();

import {
    createSubscription,allOfSubscription,getSingleSubscription,updateSubscription
} from "../controllers/subscriptionController";

router.post("/createSubscription",createSubscription);
router.get("/allsubscription",allOfSubscription);
router.get("/getSingleSubscription/:id",getSingleSubscription);

router.post("/updateSubscription",updateSubscription);



export default router;