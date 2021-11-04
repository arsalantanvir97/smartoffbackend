import express from "express";
const router = express.Router();

import {
    logs,
    toggleActiveStatus,
    getUserDetails
} from "../controllers/userController.js";

router.get("/logs", logs);
router.get("/toggle-active/:id",toggleActiveStatus);
router.get("/user-details/:id",getUserDetails);


export default router;
