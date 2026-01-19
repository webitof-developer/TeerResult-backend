import express from "express";
import {
  getDreamNumbers,
  getDreamNumberById,
  createDreamNumber,
  updateDreamNumber,
  deleteDreamNumber,
  getDreamsCount
} from "../controller/dreamController.js";


const router = express.Router();

router.get("/", getDreamNumbers);
router.get("/count", getDreamsCount);
router.get("/:id", getDreamNumberById);
router.post("/", createDreamNumber);
router.put("/:id", updateDreamNumber);
router.delete("/:id", deleteDreamNumber);

export default router;
