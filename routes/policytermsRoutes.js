import express from "express";
const router = express.Router();

import {
    createprivacyPolicy,createTermsCondition,
    privacyPolicy,termsConditions
} from "../controllers/policytermsController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createprivacyPolicy", protect,createprivacyPolicy);
router.post("/createTermsCondition", protect,createTermsCondition);
router.get("/privacyPolicy",protect, privacyPolicy);
router.get("/termsConditions",protect, termsConditions);


export default router;
