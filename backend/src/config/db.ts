import mongoose from "mongoose";
import { logger } from "../utility";

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
  } catch (error) {
    logger.error({
      message: "Database connection error",
      error: (error as Error).message,
      stack: (error as Error).stack,
    });
    process.exit(1);
  }
};

export default connectDb;
