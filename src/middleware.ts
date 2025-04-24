import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname === "/sign-in" || request.nextUrl.pathname === "/sign-up";

    if (!token) {
        // If NOT logged in and NOT on an auth page, redirect to sign-in
        if (!isAuthPage) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
        // If not logged in but on auth page, allow
        return NextResponse.next();
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);

        // ✅ Token is valid
        if (isAuthPage) {
            // If logged in and visiting sign-in/sign-up, redirect to dashboard
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error("❌ Invalid token:", err);
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
