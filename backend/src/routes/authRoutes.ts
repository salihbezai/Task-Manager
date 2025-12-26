import { Router } from "express"
import { getUserProfile, login, register, updateUserProfile } from "../controllers/authController"
import { protect } from "../middlewares/authMiddleware"
import upload from "../middlewares/uploadMiddleware"
import { logger } from "../utility"
const router = Router()

router.post("/register",register)
router.post("/login",login)
router.get("/me",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile)

router.post("/upload-image",upload.single('image'), (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message: "No file uploaded"})
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        res.status(200).json({imageUrl})
    } catch (error) {
        logger.error({
            message: "Error uploading image",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
    }

})



export default router
