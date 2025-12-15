import express from "express"
import { Request, Response } from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())


import dotenv from "dotenv"

dotenv.config()



const PORT = process.env.PORT || 5000


const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server", error)
    process.exit(1)
  }
}

startServer()

app.get("/", (req: Request, res: Response) => {
 res.status(200).json({ message: "Server is running" })
})
