import express from "express";
import {
  generateToken,
  validateToken,
  createUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/generateToken", generateToken);
router.get("/validateToken", validateToken);
router.post("/create", createUser);
export default router;
