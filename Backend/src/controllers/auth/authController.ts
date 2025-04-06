import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import  bcrypt  from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const signup = async ( req: Request, res: Response ) => {
    const { name, email, password } = req.body;

    if( !name || !email || !password ) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }

    const exisitingUser = await prisma.user.findUnique({
        where: {email},
    })

    if( exisitingUser ) {
        res.status(400).json({ error: "User already exists" });
        return;
    }
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: await bcrypt.hash(password, 10)
        }
    });
    const { password:_, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    return;

}

const login = async ( req: Request, res: Response ) => {
    console.log("Login request received", req.body);
    const { email, password } = req.body;
    if( !email || !password ) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });
    if(!user) {
        res.status(400).json({ message: "User does not exist" });
        return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production only
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

    res.status(200).json({ message: "Login successful"});
    return;
}

const logout = (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
};

export { signup, login, logout };