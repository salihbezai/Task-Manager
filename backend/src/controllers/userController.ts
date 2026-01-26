import { Request, Response } from "express";
import { logger } from "../utility";
import { User } from "../models/User";
import Task from "../models/Task";

// get all users (admin only)
export const getUsers = async (req: Request, res: Response) => {
  // add Taskcounts to each user
  try {
    const users = await User.find().select("-password").lean();
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTaskCount = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const inProgressTaskCount = await Task.countDocuments({
          assignedTo: user._id,
          status: "in-progress",
        });
        const completedTaskCount = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });
        return {
          ...user,
          pendingTaskCount,
          inProgressTaskCount,
          completedTaskCount,
        };
      }),
    );
    return res.status(200).json(usersWithTaskCounts);
  } catch (error) {
    logger.error({
      message: "Error getting users",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error getting users." });
  }
};

// get user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error({
      message: "Error getting user by ID",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error getting user by ID." });
  }
};

// delete user by id (admin only)
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    logger.error({
      message: "Error deleting user by ID",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
    res.status(500).json({ message: "Server error deleting user by ID." });
  }
};
