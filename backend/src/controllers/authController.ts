import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logger } from "../utility";
import { generateAccessToken, generateRefreshToken } from "../helper";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "%%pea8401847§%£µouhfjemakncjfkgi";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
  inviteToken?: string;
}
export interface UpdateRequestBody {
  name?: string;
  email?: string;
  password?: string;
  profileImageUrl?: string;
}

export interface JWTPayload {
  id: string;
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

    const accessToken = generateAccessToken(
      newUser._id.toString(),
      newUser.role,
    );
    const token = generateRefreshToken(newUser._id.toString());
    newUser.refreshTokens.push({
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await newUser.save();

    // respond with user data and token
    const user: RegisterResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      profileImageUrl: newUser.profileImageUrl,
      role: newUser.role,
    };
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ user, token: accessToken });
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

  // validate required fields
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
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // save refresh token to db
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    // respond with user data and token
    const response: LoginResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    };
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ user: response, token: accessToken });
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



export const refresh = async (req: Request, res: Response) => {
  try {
    const GRACE_MS = 30 * 1000; // 30 seconds grace
    const REFRESH_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

    const oldToken = req.cookies.refreshToken;
    if (!oldToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //  Verify JWT signature
    let payload: JWTPayload;
    try {
      payload = jwt.verify(oldToken, JWT_SECRET) as JWTPayload;
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //  Find user containing this refresh token
    const user = await User.findOne(
      { refreshTokens: { $elemMatch: { token: oldToken } } },
      { password: 0 },
    );

    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    //  Validate token & grace period
    const now = new Date();
    const storedToken = user.refreshTokens.find(
      (t) => t.token === oldToken && t.expiresAt > now,
    );

    if (!storedToken) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    //  Rotate token
    const newRefreshToken = generateRefreshToken(user._id.toString());
    const accessToken = generateAccessToken(user._id.toString(), user.role);

    //  Mark old token to expire soon (GRACE)
    user.refreshTokens = user.refreshTokens.map((t) =>
      t.token === oldToken
        ? { ...t, expiresAt: new Date(Date.now() + GRACE_MS) }
        : t,
    );

    //  Add new refresh token
    user.refreshTokens.push({
      token: newRefreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + REFRESH_LIFETIME_MS),
    });

    //  Cleanup expired tokens
    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.expiresAt > new Date(),
    );

    await user.save();

    //  Set cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    //  Respond
    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: accessToken,
    });
  } catch (error) {
    logger.error({
      message: "Error during refresh",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error during refresh." });
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
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
      },
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
    const updateData = req.body as Partial<UpdateRequestBody>;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
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
  const token = req.cookies?.refreshToken;
  // find the user by token
  if (token) {
    const user = await User.findOne({
      refreshTokens: { $elemMatch: { token } },
    });

    if (user) {
      // delete refresh token from db
      user.refreshTokens = user.refreshTokens.filter(
        (refreshToken) => refreshToken.token !== token,
      );
      await user.save();
    }
    console.log("logging out ...");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful." });
  }
};
