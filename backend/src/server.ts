import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"
import reportRoutes from "./routes/reportRoutes"
import userRoutes from "./routes/userRoutes"
import connectDb from "./config/db"



const app = express()

app.use(express.json())
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",   // your frontend URL
  credentials: true,                 // allow cookies
}));





import dotenv from "dotenv"

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
 app.use("/api/users",userRoutes)
 app.use("/api/tasks",taskRoutes)
 app.use("/api/reports",reportRoutes)




startServer()




