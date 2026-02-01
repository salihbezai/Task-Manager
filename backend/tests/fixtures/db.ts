import mongoose from "mongoose";
import { User } from "../../src/models/User";
import bcrypt from "bcrypt";
import { JWTPayload } from "../../src/controllers/authController";
import jwt from "jsonwebtoken";
import Task from "../../src/models/Task";

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const plain_password_user_one = "mike1234";
const plain_password_user_two = "jane1234";
let userOneToken: string;
let userTwoToken: string;
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "Mike@example.com",
  password: plain_password_user_one,
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

const userTwo = {
  _id: userTwoId,
  name: "Jane",
  email: "Jane@example.com",
  password: plain_password_user_two,
  role: "member",
  profileImageUrl: "https://example.com/jane.jpg",
};

userTwoToken = jwt.sign(
  {
    id: userTwo._id.toString(),
    email: userTwo.email,
    role: userTwo.role,
  } as JWTPayload,
  process.env.JWT_SECRET || "%%pea8401847§%£µouhfjemakncjfkgi",
  { expiresIn: "7d" },
);

// define task
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "Task 1",
  description: "Description 1",
  priority: "low",
  status: "pending",
  dueDate: new Date(),
  assignedTo: [userOne._id],
};

// define task
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Task 2",
  description: "Description 2",
  priority: "medium",
  status: "in-progress",
  dueDate: new Date(),
  assignedTo: [userTwo._id],
};

// define task
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Task 3",
  description: "Description 3",
  priority: "high",
  status: "completed",
  dueDate: new Date(),
  assignedTo: [userOne._id, userTwo._id],
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword_firtst_user = await bcrypt.hash(
    plain_password_user_one,
    salt,
  );
  const hashedPassword_second_user = await bcrypt.hash(
    plain_password_user_two,
    salt,
  );

  await new User({ ...userOne, password: hashedPassword_firtst_user }).save();
  await new User({ ...userTwo, password: hashedPassword_second_user }).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOne,
  userOneId,
  userOneToken,
  setupDatabase,
  userTwo,
  userTwoId,
  userTwoToken,
  taskOne,
  taskTwo,
  taskThree
};
