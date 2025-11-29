import { NextResponse } from "next/server";

export default async function POST(req: Request) {
    try {
        const { password, confirmPassword, token } = await req.json();
        if (password !== confirmPassword) return NextResponse.json({ message: "password not match confirm password" }, { status: 400 })
        return NextResponse.json({ message: "ffff" }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}