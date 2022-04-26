import express from "express";
const router = express.Router();

import {
    createServices,
    getServices,updateServices,singleService,deleteService

} from "../controllers/servicesController";

import { protect } from "../middlewares/authMiddleware";

router.post("/createServices", protect,createServices);
router.get("/getServices", protect,getServices);
router.get("/singleService/:id", protect,singleService);
router.get("/deleteService/:id", protect, deleteService);



router.post("/updateServices",protect, updateServices);


export default router;
