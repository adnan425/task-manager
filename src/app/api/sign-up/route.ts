import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { registerSchema } from "@/schemas/authSchema";
import { prisma } from "@/lib/prisma";
import { ERROR_MESSAGES } from "@/lib/config";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: ERROR_MESSAGES.VALIDATION_FAILED,
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { first_name, last_name, email, password } = result.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "An account with this email already exists. Please log in instead." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName: first_name,
                lastName: last_name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                message: `Welcome aboard, ${user.firstName}! Your account has been created successfully.`,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: ERROR_MESSAGES.VALIDATION_FAILED, },
            { status: 500 }
        );
    }
}
