import express from "express";
const router = express.Router();

import {
    Vendorlogs ,toggleActiveStatus,getVendorDetails,
} from "../controllers/vendorController.js";

router.get("/logs", Vendorlogs);
router.get("/toggle-active/:id",toggleActiveStatus);
router.get("/vendor-details/:id",getVendorDetails);


export default router;