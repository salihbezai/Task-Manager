import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logger } from "../utility";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "%%pea8401847§%£µouhfjemakncjfkgi";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
  inviteToken?: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: "member" | "admin";
}

interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  role: "member" | "admin";
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password, inviteToken } =
    req.body as RegisterRequestBody;

  // validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }
  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let role: "admin" | "member" = "member";
    // check the invite token admin
    if (inviteToken) {
      if (inviteToken === process.env.ADMIN_INVITE_TOKEN) {
        role = "admin";
      } else {
        return res.status(400).json({ message: "Invalid invite token." });
      }
    }

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl: req.body.profileImageUrl || null,
      role: role || "member",
    });

    // generate jwt token
    const token = jwt.sign(
      {
        id: newUser._id.toString(),
        email,
        role: newUser.role,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // respond with user data and token
    const response: RegisterResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      profileImageUrl: newUser.profileImageUrl,
      role: newUser.role,
    };
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json(response);
  } catch (error) {
    logger.error({
      message: "Error during registration",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error during registration." });
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  role: "member" | "admin";
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestBody;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // generate jwt token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email,
        role: user.role,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // respond with user data and token
    const response: LoginResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    };
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json(response);
  } catch (error) {
    logger.error({
      message: "Error during login",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error during login." });
  }
};

// get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    });
  } catch (error) {
    logger.error({
      message: "Error getting user profile",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error getting user profile." });
  }
};

// update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const updateData = req.body as Partial<RegisterRequestBody>;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    });
  } catch (error) {
    logger.error({
      message: "Error updating user profile",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error updating user profile." });
  }
};

// logout user
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ loggedOut: true, message: "User logged out successfully." });
};
