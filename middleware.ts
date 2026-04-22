import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PATHS = [
    "/dashboard",
    "/transactions",
    "/flagged",
    "/reports",
    "/settings",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAccess = request.cookies.get("aml_access")?.value === "1";

    const isProtected = PROTECTED_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isProtected && !hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
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
