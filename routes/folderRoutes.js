import express from "express";
const router = express.Router();

import {
  createFolder,
  createFile,
  getallfilesfolder,
  deleteFolder,
  deleteFile
} from "../controllers/folderController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createFolder", protect, createFolder);
router.post("/createFile", protect, createFile);
router.post("/getallfilesfolder", protect, getallfilesfolder);
router.get("/deleteFile/:id", protect, deleteFile);
router.get("/deleteFolder/:id", protect, deleteFolder);


export default router;
