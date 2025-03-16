import express from "express";
import { getLeaderboardRefreshTimer } from "../controllers/leaderboard.controller.js";
const router = express.Router();

router.get("/leaderboard/time", getLeaderboardRefreshTimer);

export default router;
