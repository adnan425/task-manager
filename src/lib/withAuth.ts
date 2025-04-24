import { cookies } from "next/headers";
import { jwtVerify, errors as JoseErrors } from "jose";
import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/lib/config";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedUser {
    sub: string;
    email: string;
    name: string;
}

export async function withAuth(): Promise<AuthenticatedUser | NextResponse> {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

        if (!payload.sub || typeof payload.email !== "string") {
            return NextResponse.json({ message: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
        }

        return {
            sub: payload.sub,
            email: payload.email,
            name: payload.name as string,
        };
    } catch (error) {
        if (error instanceof JoseErrors.JWTExpired) {
            return NextResponse.json({ message: ERROR_MESSAGES.INVALID_TOKEN }, { status: 401 });
        }

        console.error("JWT verification failed:", error);
        return NextResponse.json({ message: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
    }
}
