import express from "express";
import dotenv from "dotenv";
import { auth } from "../middlewares/AuthMiddleware.js";
import {
  loginUser,
  registerUser,
  newToken,
  logoutUser,
} from "../controllers/AuthController.js";

dotenv.config();
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/new-token", auth(process.env.JWT_REFRESH_SECRET), newToken);
router.post("/logout", auth(), logoutUser);

export default router;
