import express from "express";
import { saveTest, getTests } from "../controllers/test.controller.js";

const router = express.Router();

router.post("/save", saveTest);
router.get("/", getTests);
export default router;
