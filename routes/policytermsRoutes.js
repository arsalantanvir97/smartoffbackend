import express from "express";
const router = express.Router();

import {
  createprivacyPolicy,
  createTermsCondition,
  privacyPolicy,
  termsConditions,
  updatetermsConditions,
  updateprivacyPolicy,
  createHowitworks,
  updateHowitworks,
  howitworks,
  getpolicyterms,
  createquestion,
  updatequestions,
  question,
  createbecomevendor,
  updatebecomevendor,
  becomevendor,
  createsocialmedia,
  updatesocialmedia,
  socialmedia,
  createvideosection,
  updatevideosection,
  videosection
} from "../controllers/policytermsController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createprivacyPolicy", protect, createprivacyPolicy);
router.post("/updateprivacyPolicy", protect, updateprivacyPolicy);

router.post("/createTermsCondition", protect, createTermsCondition);
router.post("/updatetermsConditions", protect, updatetermsConditions);

router.post("/createHowitworks", protect, createHowitworks);
router.post("/updateHowitworks", protect, updateHowitworks);

router.post("/createquestion", protect, createquestion);
router.post("/updatequestions", protect, updatequestions);

router.post("/createbecomevendor", protect, createbecomevendor);
router.post("/updatebecomevendor", protect, updatebecomevendor);

router.post("/createsocialmedia", protect, createsocialmedia);
router.post("/updatesocialmedia", protect, updatesocialmedia);

router.post("/createvideosection", protect, createvideosection);
router.post("/updatevideosection", protect, updatevideosection);

router.get("/privacyPolicy", protect, privacyPolicy);
router.get("/termsConditions", protect, termsConditions);
router.get("/howitworks", protect, howitworks);
router.get("/question", protect, question);
router.get("/becomevendor", protect, becomevendor);
router.get("/socialmedia", protect, socialmedia);
router.get("/videosection", protect, videosection);

router.get("/getpolicyterms", getpolicyterms);

export default router;
