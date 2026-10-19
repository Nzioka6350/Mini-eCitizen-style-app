import express from "express";
import {
  getSubCounties,
  createSubCounty,
  deleteSubCounty,
} from "../controllers/subCountyController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSubCounties);
router.post("/", protect, authorize("admin"), createSubCounty);
router.delete("/:id", protect, authorize("admin"), deleteSubCounty);

export default router;
