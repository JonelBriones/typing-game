import express from "express";
import {
  createUser,
  login,
  refresh,
  getUserById,
  logout,
  getUserByEmail,
  getUserStats,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/user/:id", getUserById);
router.get("/stats/:username", getUserStats);
router.post("/logout", logout);
router.get("/:username", getUserByEmail);
export default router;
