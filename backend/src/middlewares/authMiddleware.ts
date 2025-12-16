import { NextFunction, Request, Response } from "express";
import { JWTPayload } from "../controllers/authController";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" })
    }
    const token = authHeader.split(" ")[1];
  
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.user = decoded;
        next();
    } catch (error) {
            console.error("Auth middleware error:", error)
         return res.status(401).json({ message: "Token is not valid" });
    }

}
