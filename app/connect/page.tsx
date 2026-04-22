"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ConnectApiPage() {
    const router = useRouter();
    const [webhookUrl, setWebhookUrl] = useState(
        "https://api.bank.ng/transactions/webhook",
    );
    const [apiKey, setApiKey] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        localStorage.setItem(
            "aml-demo-api-config",
            JSON.stringify({
                webhookUrl,
                apiKey,
                updatedAt: new Date().toISOString(),
            }),
        );

        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card
                className="w-full max-w-2xl rounded-xl border"
                style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                }}
            >
                <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">
                        Connect Transaction Webhook
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Demo step: add your transactions API webhook URL before
                        opening the dashboard.
                    </p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="webhook-url">
                                Transaction Webhook URL
                            </Label>
                            <Input
                                id="webhook-url"
                                type="url"
                                placeholder="https://api.bank.ng/transactions/webhook"
                                value={webhookUrl}
                                onChange={(event) =>
                                    setWebhookUrl(event.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="api-key">
                                Webhook API Key (Demo)
                            </Label>
                            <Input
                                id="api-key"
                                type="text"
                                placeholder="Paste your webhook API key"
                                value={apiKey}
                                onChange={(event) =>
                                    setApiKey(event.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit">Save And Continue</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard")}
                            >
                                Skip For Demo
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
