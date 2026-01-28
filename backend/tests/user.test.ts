import connectDb from "../src/config/db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {
  JWTPayload,
  UpdateRequestBody,
} from "../src/controllers/authController";
import { User } from "../src/models/User";
import bcrypt from "bcrypt";
const request = require("supertest");
const app = require("../src/app");

const userOneId = new mongoose.Types.ObjectId();
const plain_password = "mike1234";
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "Mike@example.com",
  password: plain_password,
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
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plain_password, salt);
  await new User({ ...userOne, password: hashedPassword }).save();
});

afterEach(async () => {
  await mongoose.connection.close();
});

// signup user test
test("should create a new user", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "John Doe",
      email: "q5xHd@example.com",
      password: "password123",
    })
    .expect(201);
});

// should not create user with existing email
test("should not create user with existing email", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "John Doe",
      email: userOne.email,
      password: "password123",
    })
    .expect(400);
});

// should not create user with wrong invite token
test("should not create user with wrong invite token", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "John Doe",
      email: "q5xHd@example.com",
      password: "password123",
      inviteToken: "wrong-token",
    })
    .expect(400);
});

// login user test
test("should login a user", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: userOne.email,
      password: plain_password,
    })
    .expect(200);
});

// should not login user with wrong credentials
test("should not login a user with wrong credentials", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: userOne.email,
      password: "wrongpassword",
    })
    .expect(401);
});

// should get user profile
test("should get user profile", async () => {
  await request(app)
    .get("/api/auth/me")
    .set("Cookie", `token=${userOneToken}`)
    .expect(200);
});

// should not get user profile without token
test("should not get user profile without token", async () => {
  await request(app).get("/api/auth/me").expect(401);
});

// should update user profile
test("should update user profile", async () => {
  await request(app)
    .put("/api/auth/profile")
    .set("Cookie", `token=${userOneToken}`)
    .send({
      name: "Mike",
      email: "Mike@example.com",
      profileImageUrl: "https://example.com/john.jpg",
    } as UpdateRequestBody)
    .expect(200);
});
