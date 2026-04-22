"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    LOGIN_COOKIE_MAX_AGE,
    LOGIN_COOKIE_NAME,
    LOGIN_COOKIE_VALUE,
} from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (
            document.cookie.includes(
                `${LOGIN_COOKIE_NAME}=${LOGIN_COOKIE_VALUE}`,
            )
        ) {
            router.replace("/connect");
        }
    }, [router]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        document.cookie = `${LOGIN_COOKIE_NAME}=${LOGIN_COOKIE_VALUE}; path=/; max-age=${LOGIN_COOKIE_MAX_AGE}; SameSite=Lax`;
        router.push("/connect");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card
                className="w-full max-w-md rounded-xl border"
                style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                }}
            >
                <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">Sign In</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Enter your details to continue to AML Screener.
                    </p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-xs text-muted-foreground"
                            >
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="analyst@bank.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-xs text-muted-foreground"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
