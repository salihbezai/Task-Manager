import { Router } from "express"
import { getUserProfile, login, register, updateUserProfile } from "../controllers/authController"
import { protect } from "../middlewares/authMiddleware"

const router = Router()

router.post("/register",register)
router.post("/login",login)
router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile)

export default router
