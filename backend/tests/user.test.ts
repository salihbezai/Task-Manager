import connectDb from "../src/config/db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../src/controllers/authController";
import { User } from "../src/models/User";
const request = require("supertest");
const app = require("../src/app");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "Mike@example.com",
  password: "mike1234",
  role: "admin",
  profileImageUrl: "https://example.com/mike.jpg",
};

const userOneToken = jwt.sign(
  {
    id: userOne._id.toString(),
    email: userOne.email,
    role: userOne.role,
  } as JWTPayload,
  process.env.JWT_SECRET || "%%pea8401847§%£µouhfjemakncjfkgi",
  { expiresIn: "7d" },
);

beforeEach(async () => {
  await connectDb(); 
  await User.deleteMany();
  await new User(userOne).save();
});

afterEach(async () => {
  await mongoose.connection.close(); // closes connection, so Jest can exit
});

test("should create a new task", async () => {
  await request(app)
    .post("/api/tasks/create")
    // cookies
    .set("Cookie", `token=${userOneToken}`)
    .send({
      title: "Test Task",
    })
    .expect(201);
});
