import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/authSchema";

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Some fields are missing or incorrect. Please review and try again.",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json(
                { message: "No account found with this email." },
                { status: 404 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: "Incorrect password. Please try again." },
                { status: 401 }
            );
        }

        // Generate JWT
        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        // Store JWT cookie
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: TOKEN_EXPIRY,
        });

        return NextResponse.json({
            message: `Welcome back, ${user.firstName}!`,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Something went wrong. Please try again later." },
            { status: 500 }
        );
    }
}
