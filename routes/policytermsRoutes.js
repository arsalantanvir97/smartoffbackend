import express from "express";
const router = express.Router();

import {
    createprivacyPolicy,createTermsCondition,
    privacyPolicy,termsConditions,updatetermsConditions,updateprivacyPolicy
} from "../controllers/policytermsController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createprivacyPolicy", protect,createprivacyPolicy);
router.post("/updateprivacyPolicy", protect,updateprivacyPolicy);

router.post("/createTermsCondition", protect,createTermsCondition);
router.post("/updatetermsConditions", protect,updatetermsConditions);


router.get("/privacyPolicy",protect, privacyPolicy);
router.get("/termsConditions",protect, termsConditions);


export default router;
