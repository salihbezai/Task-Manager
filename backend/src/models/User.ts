import mongoose, { Schema } from "mongoose";


export interface IUser {
    name: string;
    email: string;
    password: string;
    profileImageUrl?: string;
    role: "member" | "admin";
}


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String },
    role: { type: String, enum: ["member", "admin"], default: "member" },
},
{ timestamps: true }
)

module.exports = mongoose.model("User", userSchema);