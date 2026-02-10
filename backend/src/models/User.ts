import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
  role: "member" | "admin";
  refreshTokens: { token: string; createdAt: Date, expiresAt: Date }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String },
    role: { type: String, enum: ["member", "admin"], default: "member" },
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date }
      },
    ],
  },
  { timestamps: true },
);

export const User: mongoose.Model<IUser> = mongoose.model("User", userSchema);
