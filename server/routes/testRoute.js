import express from "express";
import {
  saveTest,
  getTests,
  getLeaderboard,
  updateLeaderboard,
} from "../controllers/test.controller.js";

const router = express.Router();

router.post("/save", saveTest);
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/update", updateLeaderboard);
export default router;
