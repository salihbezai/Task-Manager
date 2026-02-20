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
// router.post("/upload-image", protect, upload.single("image"),async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     const imageUrl = `/uploads/${req.file.filename}`;
//     // update user profile image
//     const userId = req.user?.id;
//     const updateData = { profileImageUrl: imageUrl };
//     const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
//     res.status(200).json({ imageUrl });
//   } catch (error) {
//     logger.error({
//       message: "Error uploading image",
//       error: (error as Error).message,
//       stack: (error as Error).stack,
//       route: req.originalUrl,
//     });
//   }
// });

router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = (req.file as any).path;

      const userId = req.user?.id;
      await User.findByIdAndUpdate(userId, {
        profileImageUrl: imageUrl,
      });

      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);
// update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const userId = req.user?.id;
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
    res.status(200).json({ user });
  } catch (error) {
    logger.error({
      message: "Error updating user profile",
      error: (error as Error).message,
      stack: (error as Error).stack,
      route: req.originalUrl,
    });
  }
});

export default router;
