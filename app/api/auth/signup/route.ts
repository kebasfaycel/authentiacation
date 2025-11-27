import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/user";
import ConnectToDatabase from "@/lib/mongodb";
export async function POST(request: Request) {
    const { name, email, password, confirmPassword } = await request.json();
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    };
    if (!name || !email || !password || !confirmPassword) return NextResponse.json(
        { message: "All fields are required" }, { status: 400 }
    );
    if (!isValidEmail(email)) return NextResponse.json({ message: "invalid email format" }, {
        status: 400
    });
    if (password !== confirmPassword) {
        return NextResponse.json({ message: "password do not match" }, { status: 400 });
    }
    if (password.length < 6) return NextResponse.json({ message: "password must be at least 6 characters length" }, { status: 400 });
    try {
        await ConnectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) return NextResponse.json({ message: "user already exist" }, { status: 400 });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save();
        return NextResponse.json({ message: "user created" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "something went wrong" }, { status: 500 });
    }
}
