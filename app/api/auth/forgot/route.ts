import { ResetPasswordEmail } from '@/components/email.template';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import ConnectToDatabase from '@/lib/mongodb';
import User from '@/models/user';
import crypto from "crypto";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email } = await req.json();
    try {
        await ConnectToDatabase();
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "user doesn't exist" }, { status: 404 });
        const token = crypto.randomBytes(40).toString("hex");
        const expires = Date.now() + 1000 * 60 * 60;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email,],
            subject: 'resend email',
            react: ResetPasswordEmail({
                resetLink: resetLink
            }),
        });
        return NextResponse.json({ message: "reset Link sent" }, { status: 200 });
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}