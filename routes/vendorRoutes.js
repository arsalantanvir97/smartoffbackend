import express from "express";
const router = express.Router();

import {
    Vendorlogs ,toggleActiveStatus,getVendorDetails,
} from "../controllers/vendorController.js";
import { protect } from "../middlewares/authMiddleware";

router.get("/logs",protect, Vendorlogs);
router.get("/toggle-active/:id",protect,toggleActiveStatus);
router.get("/vendor-details/:id",protect,getVendorDetails);


export default router;