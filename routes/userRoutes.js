import express from "express";
const router = express.Router();

import {
    logs,
    toggleActiveStatus,
    getUserDetails,getLatestUsers,getCountofallCollection
} from "../controllers/userController.js";

router.get("/logs", logs);
router.get("/toggle-active/:id",toggleActiveStatus);
router.get("/user-details/:id",getUserDetails);
router.get("/getlatestusers", getLatestUsers);
router.get("/getCountofallCollection", getCountofallCollection);


export default router;
