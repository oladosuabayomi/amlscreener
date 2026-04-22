import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LOGIN_COOKIE_NAME, LOGIN_COOKIE_VALUE } from "@/lib/auth";

const PROTECTED_PATHS = [
    "/dashboard",
    "/transactions",
    "/flagged",
    "/reports",
    "/settings",
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAccess =
        request.cookies.get(LOGIN_COOKIE_NAME)?.value === LOGIN_COOKIE_VALUE;

    const isProtected = PROTECTED_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isProtected && !hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (pathname === "/" && hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/transactions/:path*",
        "/flagged/:path*",
        "/reports/:path*",
        "/settings/:path*",
    ],
};
