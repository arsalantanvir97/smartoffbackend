import express from "express";
const router = express.Router();

import {
  createBranch,
  Branchlogs,
  getBranchDetails,
  editBranch,
  allBranches,
  deleteBranch
} from "../controllers/branchController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createBranch", protect, createBranch);
router.get("/Branchlogs", protect, Branchlogs);
router.post("/getBranchDetails", protect, getBranchDetails);
router.post("/editBranch", protect, editBranch);
router.get("/allBranches", protect, allBranches);
router.get("/deleteBranch/:id", protect, deleteBranch);

export default router;
