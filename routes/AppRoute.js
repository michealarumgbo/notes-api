import express from "express";
import dotenv from "dotenv";
import { auth } from "../middlewares/AuthMiddleware.js";
import {
  createNote,
  editNote,
  deleteNote,
  getNote,
  getNotes,
} from "../controllers/AppController.js";

dotenv.config();
const router = express.Router();

router.get("/notes", auth(process.env.JWT_ACCESS_SECRET), getNotes);
router.get("/note/:id", auth(process.env.JWT_ACCESS_SECRET), getNote);
router.post("/create-note", auth(process.env.JWT_ACCESS_SECRET), createNote);
router.patch("/note/:id", auth(process.env.JWT_ACCESS_SECRET), editNote);
router.delete("/note/:id", auth(process.env.JWT_ACCESS_SECRET), deleteNote);

export default router;
