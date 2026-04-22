"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DataMode = "API" | "UPLOAD";

export default function AccessGatewayPage() {
    const router = useRouter();

    const [organizationName, setOrganizationName] = useState("");
    const [workEmail, setWorkEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dataMode, setDataMode] = useState<DataMode>("API");
    const [apiEndpoint, setApiEndpoint] = useState(
        "https://api.bank.ng/transactions",
    );
    const [fileName, setFileName] = useState("");

    const canContinue = useMemo(() => {
        const hasUser =
            organizationName.trim().length > 1 &&
            workEmail.trim().includes("@") &&
            password.trim().length >= 6;

        if (!hasUser) return false;

        if (dataMode === "API") {
            return apiEndpoint.trim().startsWith("http");
        }

        return fileName.trim().length > 0;
    }, [
        apiEndpoint,
        dataMode,
        fileName,
        organizationName,
        password,
        workEmail,
    ]);

    const handleContinue = () => {
        localStorage.setItem(
            "aml-access-profile",
            JSON.stringify({
                organizationName,
                workEmail,
                dataMode,
                apiEndpoint: dataMode === "API" ? apiEndpoint : null,
                fileName: dataMode === "UPLOAD" ? fileName : null,
                createdAt: new Date().toISOString(),
            }),
        );

        document.cookie = "aml_access=1; path=/; max-age=86400; samesite=lax";
        router.push("/dashboard");
    };

    return (
        <div className="p-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <section
                    className="rounded-xl border p-4"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--surface)",
                    }}
                >
                    <h2 className="text-lg font-semibold tracking-wider uppercase">
                        Access Control Setup
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Sign in as an organization user, choose your ingestion
                        path, then continue to the dashboard.
                    </p>
                </section>

                <Card
                    style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-sm">Demo Credentials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs">
                        <p>
                            Organization: <span className="font-mono">AML Demo Bank</span>
                        </p>
                        <p>
                            Email: <span className="font-mono">demo@amlscreener.ng</span>
                        </p>
                        <p>
                            Password: <span className="font-mono">Demo@123</span>
                        </p>
                    </CardContent>
                </Card>

                <Card
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-sm">User Sign In</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="org-name">Organization</Label>
                            <Input
                                id="org-name"
                                placeholder="ACME Bank Plc"
                                value={organizationName}
                                onChange={(event) =>
                                    setOrganizationName(event.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="work-email">Work Email</Label>
                            <Input
                                id="work-email"
                                type="email"
                                placeholder="aml@acmebank.ng"
                                value={workEmail}
                                onChange={(event) =>
                                    setWorkEmail(event.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-sm">
                            Data Source Connection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Tabs
                            value={dataMode}
                            onValueChange={(value) =>
                                setDataMode(value as DataMode)
                            }
                        >
                            <TabsList
                                variant="line"
                                className="w-full justify-start overflow-auto"
                            >
                                <TabsTrigger value="API">
                                    Connect API
                                </TabsTrigger>
                                <TabsTrigger value="UPLOAD">
                                    Upload File
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {dataMode === "API" ? (
                            <div className="space-y-1.5">
                                <Label htmlFor="api-endpoint">
                                    Transaction API Endpoint
                                </Label>
                                <Input
                                    id="api-endpoint"
                                    placeholder="https://api.bank.ng/transactions"
                                    value={apiEndpoint}
                                    onChange={(event) =>
                                        setApiEndpoint(event.target.value)
                                    }
                                />
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <Label htmlFor="upload-file">
                                    Transaction File
                                </Label>
                                <Input
                                    id="upload-file"
                                    type="file"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        setFileName(file?.name ?? "");
                                    }}
                                />
                                {fileName ? (
                                    <p className="text-xs text-muted-foreground">
                                        Selected: {fileName}
                                    </p>
                                ) : null}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                onClick={handleContinue}
                                disabled={!canContinue}
                            >
                                Continue To Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
