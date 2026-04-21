"use client";

import { useEffect, useMemo, useState } from "react";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { ThresholdPanel } from "@/components/settings/ThresholdPanel";
import { NotificationPanel } from "@/components/settings/NotificationPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    const [ruleSmurfing, setRuleSmurfing] = useState(true);
    const [ruleGeoAnomaly, setRuleGeoAnomaly] = useState(true);
    const [ruleVelocitySpike, setRuleVelocitySpike] = useState(true);
    const [ruleRoundTripping, setRuleRoundTripping] = useState(true);
    const [backendStatus, setBackendStatus] = useState<
        "CHECKING" | "ONLINE" | "OFFLINE"
    >("CHECKING");

    const apiEndpoint = useMemo(
        () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
        [],
    );

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        async function checkBackend() {
            try {
                const response = await fetch(`${apiEndpoint}/health`, {
                    method: "GET",
                    signal: controller.signal,
                });
                if (!mounted) return;
                setBackendStatus(response.ok ? "ONLINE" : "OFFLINE");
            } catch {
                if (!mounted) return;
                setBackendStatus("OFFLINE");
            }
        }

        checkBackend();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [apiEndpoint]);

    return (
        <div className="p-6 space-y-6">
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ProfileCard />
                <ThresholdPanel />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-sm">Risk Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <label
                            className="flex items-center justify-between border p-3"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--surface-2)",
                            }}
                        >
                            <span className="text-sm font-medium">
                                SMURFING detection
                            </span>
                            <Checkbox
                                checked={ruleSmurfing}
                                onCheckedChange={(checked) =>
                                    setRuleSmurfing(Boolean(checked))
                                }
                            />
                        </label>
                        <label
                            className="flex items-center justify-between border p-3"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--surface-2)",
                            }}
                        >
                            <span className="text-sm font-medium">
                                GEO_ANOMALY detection
                            </span>
                            <Checkbox
                                checked={ruleGeoAnomaly}
                                onCheckedChange={(checked) =>
                                    setRuleGeoAnomaly(Boolean(checked))
                                }
                            />
                        </label>
                        <label
                            className="flex items-center justify-between border p-3"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--surface-2)",
                            }}
                        >
                            <span className="text-sm font-medium">
                                VELOCITY_SPIKE detection
                            </span>
                            <Checkbox
                                checked={ruleVelocitySpike}
                                onCheckedChange={(checked) =>
                                    setRuleVelocitySpike(Boolean(checked))
                                }
                            />
                        </label>
                        <label
                            className="flex items-center justify-between border p-3"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--surface-2)",
                            }}
                        >
                            <span className="text-sm font-medium">
                                ROUND_TRIPPING detection
                            </span>
                            <Checkbox
                                checked={ruleRoundTripping}
                                onCheckedChange={(checked) =>
                                    setRuleRoundTripping(Boolean(checked))
                                }
                            />
                        </label>
                    </CardContent>
                </Card>

                <NotificationPanel />
            </section>

            <section>
                <Card
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-sm">System Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div
                            className="flex items-center justify-between gap-3 border p-3"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--surface-2)",
                            }}
                        >
                            <p className="text-xs text-muted-foreground">
                                API Endpoint
                            </p>
                            <p className="font-mono text-xs">{apiEndpoint}</p>
                        </div>
                        <div
                            className="flex items-center justify-between gap-3 border p-3"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--surface-2)",
                            }}
                        >
                            <p className="text-xs text-muted-foreground">
                                Backend Status
                            </p>
                            <Badge
                                variant={
                                    backendStatus === "ONLINE"
                                        ? "default"
                                        : backendStatus === "OFFLINE"
                                          ? "destructive"
                                          : "secondary"
                                }
                            >
                                {backendStatus}
                            </Badge>
                        </div>
                        <div
                            className="flex items-center justify-between gap-3 border p-3"
                            style={{
                                borderColor: "var(--border)",
                                background: "var(--surface-2)",
                            }}
                        >
                            <p className="text-xs text-muted-foreground">
                                Version
                            </p>
                            <Badge variant="outline">v0.1.0</Badge>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
