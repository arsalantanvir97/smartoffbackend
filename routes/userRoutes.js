import express from "express";
const router = express.Router();

import {
    logs,
    toggleActiveStatus,
    getUserDetails,getLatestUsers,getCountofallCollection
} from "../controllers/userController.js";
import { protect } from '../middlewares/authMiddleware'

router.get("/logs",protect, logs);
router.get("/toggle-active/:id",protect,toggleActiveStatus);
router.get("/user-details/:id",protect,getUserDetails);
router.get("/getlatestusers", protect,getLatestUsers);
router.get("/getCountofallCollection",protect,getCountofallCollection)
// router.route("/getallNotification").get(protect,getttingalltheNotification);


export default router;
