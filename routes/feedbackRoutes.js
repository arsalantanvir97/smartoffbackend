import express from "express";
const router = express.Router();

import {
    createFeedback,Feedbacklogs,getFeedbackDetails
} from "../controllers/feedbackController";

router.post("/create-feedback",createFeedback);
router.get("/Feedbacklogs",Feedbacklogs);
router.get("/feedback-details/:id",getFeedbackDetails);


export default router;