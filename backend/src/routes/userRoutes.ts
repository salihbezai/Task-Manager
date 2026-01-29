import { Router } from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
} from "../controllers/userController";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/uploadMiddleware";
import { logger } from "../utility";
import { User } from "../models/User";
const router = Router();

// get users
router.get("/", protect, getUsers);

// GET USER BY ID
router.get("/:id", protect, getUserById);

// Delete user by id (admin only)
router.delete("/delete/:id", protect, adminOnly, deleteUserById);


// upload image profile 
router.post("/upload-image", protect, upload.single("image"),async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("the request file is "+req.file)
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    // update user profile image
    const userId = req.user?.id;
    const updateData = { profileImageUrl: imageUrl };
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
    console.log("the id is "+userId)
    console.log("look "+JSON.stringify(user))
    res.status(200).json({ imageUrl });
  } catch (error) {
    logger.error({
      message: "Error uploading image",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
  }
});

export default router;
