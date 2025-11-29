import ConnectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { password, confirmPassword, token } = await req.json();
        if (password !== confirmPassword) return NextResponse.json({ message: "password not match confirm password" }, { status: 400 })
        await ConnectToDatabase()
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if (!user) return NextResponse.json({ message: "Invalid token or expired one" }, { status: 404 });
        if (user) {
            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        }
        return NextResponse.json({ message: "password updated" }, { status: 200 });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "server error" }, { status: 500 });
    }
}