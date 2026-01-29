import mongoose from "mongoose";
import { User } from "../../src/models/User";
import bcrypt from 'bcrypt';
import { JWTPayload } from "../../src/controllers/authController";
import jwt from 'jsonwebtoken';

const userOneId = new mongoose.Types.ObjectId();
const plain_password = "mike1234";
let userOneToken: string;
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "Mike@example.com",
  password: plain_password,
  role: "admin",
  profileImageUrl: "https://example.com/mike.jpg",
};

  userOneToken = jwt.sign(
    {
      id: userOne._id.toString(),
      email: userOne.email,
      role: userOne.role,
    } as JWTPayload,
    process.env.JWT_SECRET || "%%pea8401847§%£µouhfjemakncjfkgi",
    { expiresIn: "7d" },
  );

const setupDatabase = async () => {
  await User.deleteMany();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plain_password, salt);
   await new User({ ...userOne, password: hashedPassword }).save();
}

module.exports = {
  userOne,
  userOneId,
  userOneToken,
  setupDatabase
};