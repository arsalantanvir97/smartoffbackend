import express from "express";
const router = express.Router();

import {
  createFolder,
  createFile,
  getallfilesfolder,
  deleteFolder,
  deleteFile,
  folderDetails,
  uploadFilesinFolder,
  deleteFileinFolder,
  searchbyFileName,
  searchFilesinFolder,
  editFolder,
  recentFiles,
  createaFolder,
  uploadFilesinaFolder,
  searchbyaFileName,
  searchFilesinaFolder
} from "../controllers/folderController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createFolder", protect, createFolder);
router.post("/createaFolder", protect, createaFolder);
router.post("/createFile", protect, createFile);
router.post("/getallfilesfolder", protect, getallfilesfolder);
router.get("/deleteFile/:id", protect, deleteFile);
router.get("/deleteFolder/:id", protect, deleteFolder);
router.get("/folderDetails/:id", protect, folderDetails);
router.post("/deleteFileinFolder/:id", protect, deleteFileinFolder);
router.post("/uploadFilesinFolder", protect, uploadFilesinFolder);
router.post("/uploadFilesinaFolder", protect, uploadFilesinaFolder);


router.post("/searchbyFileName", protect, searchbyFileName);
router.post("/searchbyaFileName", protect, searchbyaFileName);

router.post("/searchFilesinFolder", protect, searchFilesinFolder);
router.post("/searchFilesinaFolder", protect, searchFilesinaFolder);

router.post("/editFolder", protect, editFolder);
router.get("/recentFiles", protect, recentFiles);

export default router;
