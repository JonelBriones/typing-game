import express from "express";
import {
  createUser,
  login,
  refresh,
  getUserById,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/:id", getUserById);
export default router;
