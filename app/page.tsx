import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOGIN_COOKIE_NAME, LOGIN_COOKIE_VALUE } from "@/lib/auth";

export default async function HomePage() {
    const cookieStore = await cookies();
    const isLoggedIn =
        cookieStore.get(LOGIN_COOKIE_NAME)?.value === LOGIN_COOKIE_VALUE;

    redirect(isLoggedIn ? "/connect" : "/login");
}
