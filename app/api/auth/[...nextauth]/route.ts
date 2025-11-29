import NextAuth from "next-auth";
import User from "@/models/user";
import ConnectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
    session: {
        strategy: "jwt",
    }, providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials", credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            }, async authorize(credentials) {
                try {
                    await ConnectToDatabase();
                    const user = await User.findOne({ email: credentials?.email });
                    if (!user) throw new Error("User not found");
                    const isValidPassword = await bcrypt.compare(credentials?.password ?? "", user.password as string);
                    if (!isValidPassword) throw new Error("password incorrect");
                    return user;
                }
                catch (error) {
                    console.log(error);
                    return null;

                }


            }
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "github" || account?.provider === "google") {
                await ConnectToDatabase();
                const existingUser = await User.findOne({ email: profile?.email });
                if (!existingUser) {
                    await User.create({
                        name: profile?.name,
                        email: profile?.email
                    })
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ token, session }) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    image: token.picture,
                }
            }
            return session;
        }
    },
    pages: {
        signIn: "/sign-in",
    }, secret: process.env.AUTH_SECRET
});
export { handler as GET, handler as POST }
