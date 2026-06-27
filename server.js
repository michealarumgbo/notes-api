import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import appRouter from "./routes/AppRoute.js";
import authRouter from "./routes/AuthRoute.js";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";

dotenv.config();
// initiate express app
const app = express();

// await connection to database
await connectDB();

// allow croos-origin resource sharing
app.use(cors());
// allow json input
app.use(express.json());

// routes
app.use("/notes-api/v1/app", appRouter);
app.use("/notes-api/v1/auth", authRouter);

app.use("", errorMiddleware);

// extract port
const PORT = process.env.PORT || 3030;

// start server
app.listen(PORT, (error) => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
