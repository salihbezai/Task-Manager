import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import reportRoutes from "./routes/reportRoutes";
import userRoutes from "./routes/userRoutes";
import connectDb from "./config/db";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

import dotenv from "dotenv";

dotenv.config();





app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);


module.exports = app
