import { Router } from "express"
import { Request, Response } from "express"

const router = Router()

router.get("/login",(req: Request, res: Response) => {
    res.status(200).json({ message: "Login successful" })
})

export default router
