import express from "express";
const router = express.Router();

import {
  createBranch,
  Branchlogs,
  getBranchDetails,
  editBranch,
  allBranches,
  deleteBranch,
  BranchlogsofVendor,
  allBranchesofVendor
} from "../controllers/branchController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createBranch", protect, createBranch);
router.get("/Branchlogs", protect, Branchlogs);
router.get("/BranchlogsofVendor", protect, BranchlogsofVendor);

router.post("/getBranchDetails", protect, getBranchDetails);
router.post("/editBranch", protect, editBranch);
router.get("/allBranches", protect, allBranches);
router.get("/deleteBranch/:id", protect, deleteBranch);
router.post("/allBranchesofVendor", protect, allBranchesofVendor);


export default router;
