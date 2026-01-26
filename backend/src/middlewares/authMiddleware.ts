import { NextFunction, Request, Response } from "express";
import { JWTPayload } from "../controllers/authController";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logger } from "../utility";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "%%pea8401847§%£µouhfjemakncjfkgi";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // const authHeader = req.headers?.authorization;
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error({
      message: "Auth middleware error",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// admine only access middleware

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};
