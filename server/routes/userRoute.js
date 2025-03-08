import express from "express";
import {
  createUser,
  login,
  refresh,
  getUserById,
  logout,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/user/:id", getUserById);
router.post("/logout", logout);
export default router;
