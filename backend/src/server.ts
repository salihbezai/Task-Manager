import express from "express"
import { Request, Response } from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())


import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"
import reportRoutes from "./routes/reportRoutes"
import connectDb from "./config/db"



import dotenv from "dotenv"
import { protect } from './middlewares/authMiddleware';
import Task from "./models/Task"

dotenv.config()

const PORT = process.env.PORT || 5000




const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server", error)
    process.exit(1)
  }
}


 app.use("/api/auth",authRoutes)
// app.use("/api/users",userRoutes)
 app.use("/api/tasks",protect,taskRoutes)
 app.use("/api/reports",protect,reportRoutes)




startServer()




