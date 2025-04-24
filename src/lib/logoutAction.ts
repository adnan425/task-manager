"use server";

import { cookies } from "next/headers";

export async function logout() {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return { message: "Logged out successfully." };
}