import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { User } from "../models/User"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "%%pea8401847§%£µouhfjemakncjfkgi";

interface RegisterRequestBody {
    name: string,
    email: string,
    password: string,
    role?: "member" | "admin"
}

interface JWTPayload {
    id: string,
    email: string
}

interface RegisterResponse {
    user: {
        id: string,
        name: string,
        email: string,
        role: "member" | "admin"
    },
    token: string
}

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body as RegisterRequestBody;

    // validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "member"
        })

        // generate jwt token
        const token = jwt.sign(
            {
            id: newUser._id.toString(),
            email
           } as JWTPayload,
         JWT_SECRET, 
         { expiresIn: "7d" })

        // respond with user data and token
        const response : RegisterResponse = {
            user:{
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        }

        res.status(201).json(response)
    } catch (error){
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
}


interface LoginRequestBody {
    email: string,
    password: string
}

interface LoginResponse {
    user: {
        id: string,
        name: string,
        email: string,
        role: "member" | "admin"
    },
    token: string
}



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequestBody;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    try {
        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // generate jwt token
        const token = jwt.sign(
            {
            id: user._id.toString(),
            email
           } as JWTPayload,
         JWT_SECRET, 
         { expiresIn: "7d" })

        // respond with user data and token
        const response: LoginResponse = {
            user:{
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }
        res.status(200).json(response)
    } catch (error){
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
}