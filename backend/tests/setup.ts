import connectDb from "../src/config/db";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectDb();
});



afterAll(async () => {
  await mongoose.connection.close();
});
