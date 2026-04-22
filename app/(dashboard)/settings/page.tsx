"use client";

import { useEffect, useMemo, useState } from "react";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { ThresholdPanel } from "@/components/settings/ThresholdPanel";
import { NotificationPanel } from "@/components/settings/NotificationPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ConnectionMode = "WEBHOOK" | "HTTP_PULL";
type WebhookAuthMethod = "NONE" | "BEARER_TOKEN" | "HMAC_SHA256";
type HttpAuthMethod = "NONE" | "BEARER_TOKEN" | "API_KEY" | "BASIC_AUTH";

function createEndpointId(): string {
    return Math.random().toString(36).slice(2, 12);
}

export default function SettingsPage() {
    const [ruleSmurfing, setRuleSmurfing] = useState(true);
    const [ruleGeoAnomaly, setRuleGeoAnomaly] = useState(true);
    const [ruleVelocitySpike, setRuleVelocitySpike] = useState(true);
    const [ruleRoundTripping, setRuleRoundTripping] = useState(true);
    const [backendStatus, setBackendStatus] = useState<
        "CHECKING" | "ONLINE" | "OFFLINE"
    >("CHECKING");
    const [sourceUrl, setSourceUrl] = useState("https://corebanking.bank.ng");
    const [connectionMode, setConnectionMode] =
        useState<ConnectionMode>("WEBHOOK");
    const [webhookPathId, setWebhookPathId] = useState(createEndpointId);
    const [deploymentOrigin, setDeploymentOrigin] = useState(
        "https://aml-screener.internal",
    );
    const [webhookAuthMethod, setWebhookAuthMethod] =
        useState<WebhookAuthMethod>("HMAC_SHA256");
    const [webhookSecretKey, setWebhookSecretKey] = useState("");
    const [webhookBearerToken, setWebhookBearerToken] = useState("");
    const [webhookSignatureHeader, setWebhookSignatureHeader] = useState(
        "X-AML-Signature",
    );
    const [httpEndpoint, setHttpEndpoint] = useState("");
    const [httpMethod, setHttpMethod] = useState<"GET" | "POST">("GET");
    const [httpAuthMethod, setHttpAuthMethod] =
        useState<HttpAuthMethod>("BEARER_TOKEN");
    const [httpApiKeyHeader, setHttpApiKeyHeader] = useState("X-API-Key");
    const [httpAuthKey, setHttpAuthKey] = useState("");
    const [httpUsername, setHttpUsername] = useState("");
    const [httpPassword, setHttpPassword] = useState("");
    const [pollIntervalSecs, setPollIntervalSecs] = useState(60);
    const [copied, setCopied] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

    const apiEndpoint = useMemo(
        () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
        [],
    );
    const generatedWebhookEndpoint = useMemo(
        () => `${deploymentOrigin}/api/ingest/webhook/${webhookPathId}`,
        [deploymentOrigin, webhookPathId],
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

    useEffect(() => {
        setDeploymentOrigin(window.location.origin);
    }, []);

    const handleCopyEndpoint = async () => {
        try {
            await navigator.clipboard.writeText(generatedWebhookEndpoint);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    const handleSaveIntegration = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLastSavedAt(new Date().toLocaleString("en-NG"));
    };

    const handleDownloadSamplePayload = () => {
        const samplePayload =
            connectionMode === "WEBHOOK"
                ? {
                      integration: {
                          mode: "WEBHOOK",
                          sourceUrl,
                          endpoint: generatedWebhookEndpoint,
                          auth:
                              webhookAuthMethod === "NONE"
                                  ? { method: "NONE" }
                                  : webhookAuthMethod === "BEARER_TOKEN"
                                    ? {
                                          method: "BEARER_TOKEN",
                                          token:
                                              webhookBearerToken ||
                                              "replace-with-shared-token",
                                      }
                                    : {
                                          method: "HMAC_SHA256",
                                          signatureHeader:
                                              webhookSignatureHeader,
                                          secret:
                                              webhookSecretKey ||
                                              "replace-with-hmac-secret",
                                      },
                      },
                      event: {
                          id: "evt_001",
                          type: "transaction.created",
                          occurredAt: new Date().toISOString(),
                          transaction: {
                              transactionId: "TXN-983450",
                              amount: 2450000,
                              currency: "NGN",
                              channel: "MOBILE_BANKING",
                              senderAccount: "2014567789",
                              receiverAccount: "1023345567",
                              narration: "Cross-border vendor settlement",
                          },
                      },
                  }
                : {
                      integration: {
                          mode: "HTTP_PULL",
                          sourceUrl,
                          endpoint:
                              httpEndpoint ||
                              "https://provider.bank.ng/api/v1/transactions",
                          requestMethod: httpMethod,
                          pollIntervalSecs,
                          auth:
                              httpAuthMethod === "NONE"
                                  ? { method: "NONE" }
                                  : httpAuthMethod === "BEARER_TOKEN"
                                    ? {
                                          method: "BEARER_TOKEN",
                                          token:
                                              httpAuthKey ||
                                              "replace-with-bearer-token",
                                      }
                                    : httpAuthMethod === "API_KEY"
                                      ? {
                                            method: "API_KEY",
                                            header:
                                                httpApiKeyHeader || "X-API-Key",
                                            key:
                                                httpAuthKey ||
                                                "replace-with-api-key",
                                        }
                                      : {
                                            method: "BASIC_AUTH",
                                            username:
                                                httpUsername ||
                                                "integration-user",
                                            password:
                                                httpPassword ||
                                                "replace-with-password",
                                        },
                      },
                      responseSample: {
                          cursor: "next-page-token",
                          transactions: [
                              {
                                  transactionId: "TXN-983450",
                                  amount: 2450000,
                                  currency: "NGN",
                                  timestamp: new Date().toISOString(),
                                  senderAccount: "2014567789",
                                  receiverAccount: "1023345567",
                                  country: "NG",
                              },
                          ],
                      },
                  };

        const blob = new Blob([JSON.stringify(samplePayload, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
            connectionMode === "WEBHOOK"
                ? "webhook-sample-payload.json"
                : "http-pull-sample-payload.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

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
                        <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-sm">
                                Data Source Integration
                            </CardTitle>
                            <Badge variant="outline">No auth backend</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-5"
                            onSubmit={handleSaveIntegration}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="source-url">
                                        Source URL
                                    </Label>
                                    <Input
                                        id="source-url"
                                        type="url"
                                        placeholder="https://corebanking.bank.ng"
                                        value={sourceUrl}
                                        onChange={(event) =>
                                            setSourceUrl(event.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="connection-mode">
                                        Connection Mode
                                    </Label>
                                    <Select
                                        value={connectionMode}
                                        onValueChange={(value) =>
                                            setConnectionMode(
                                                value as ConnectionMode,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="connection-mode"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select connection mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="WEBHOOK">
                                                Webhook Push
                                            </SelectItem>
                                            <SelectItem value="HTTP_PULL">
                                                HTTP Pull
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {connectionMode === "WEBHOOK" ? (
                                <div
                                    className="border p-4 space-y-4"
                                    style={{
                                        borderColor: "var(--border)",
                                        background: "var(--surface-2)",
                                    }}
                                >
                                    <div className="space-y-1.5">
                                        <Label htmlFor="generated-endpoint">
                                            Customer Webhook Endpoint
                                        </Label>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Input
                                                id="generated-endpoint"
                                                value={
                                                    generatedWebhookEndpoint
                                                }
                                                readOnly
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCopyEndpoint}
                                            >
                                                {copied ? "Copied" : "Copy"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setWebhookPathId(
                                                        createEndpointId(),
                                                    )
                                                }
                                            >
                                                Regenerate
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Share this endpoint with your
                                            upstream system to push transaction
                                            events into AML Screener.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="webhook-auth">
                                            Authentication Mechanism
                                        </Label>
                                        <Select
                                            value={webhookAuthMethod}
                                            onValueChange={(value) =>
                                                setWebhookAuthMethod(
                                                    value as WebhookAuthMethod,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="webhook-auth"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select webhook auth method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NONE">
                                                    None
                                                </SelectItem>
                                                <SelectItem value="BEARER_TOKEN">
                                                    Bearer Token
                                                </SelectItem>
                                                <SelectItem value="HMAC_SHA256">
                                                    HMAC SHA-256 Signature
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {webhookAuthMethod === "BEARER_TOKEN" ? (
                                        <div className="space-y-1.5">
                                            <Label htmlFor="webhook-bearer-token">
                                                Bearer Token
                                            </Label>
                                            <Input
                                                id="webhook-bearer-token"
                                                placeholder="Enter shared bearer token"
                                                value={webhookBearerToken}
                                                onChange={(event) =>
                                                    setWebhookBearerToken(
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    ) : null}

                                    {webhookAuthMethod === "HMAC_SHA256" ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="webhook-secret">
                                                    Signing Secret
                                                </Label>
                                                <Input
                                                    id="webhook-secret"
                                                    placeholder="Enter HMAC secret key"
                                                    value={webhookSecretKey}
                                                    onChange={(event) =>
                                                        setWebhookSecretKey(
                                                            event.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="signature-header">
                                                    Signature Header
                                                </Label>
                                                <Input
                                                    id="signature-header"
                                                    placeholder="X-AML-Signature"
                                                    value={
                                                        webhookSignatureHeader
                                                    }
                                                    onChange={(event) =>
                                                        setWebhookSignatureHeader(
                                                            event.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div
                                    className="border p-4 space-y-4"
                                    style={{
                                        borderColor: "var(--border)",
                                        background: "var(--surface-2)",
                                    }}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="http-endpoint">
                                                Provider HTTP Endpoint
                                            </Label>
                                            <Input
                                                id="http-endpoint"
                                                type="url"
                                                placeholder="https://provider.bank.ng/api/v1/transactions"
                                                value={httpEndpoint}
                                                onChange={(event) =>
                                                    setHttpEndpoint(
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="http-method">
                                                Request Method
                                            </Label>
                                            <Select
                                                value={httpMethod}
                                                onValueChange={(value) =>
                                                    setHttpMethod(
                                                        value as "GET" | "POST",
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="http-method"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Select HTTP method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GET">
                                                        GET
                                                    </SelectItem>
                                                    <SelectItem value="POST">
                                                        POST
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="poll-interval">
                                                Poll Interval (seconds)
                                            </Label>
                                            <Input
                                                id="poll-interval"
                                                type="number"
                                                min={15}
                                                step={15}
                                                value={pollIntervalSecs}
                                                onChange={(event) =>
                                                    setPollIntervalSecs(
                                                        Number(
                                                            event.target.value,
                                                        ) || 15,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="http-auth-method">
                                                Authorization Method
                                            </Label>
                                            <Select
                                                value={httpAuthMethod}
                                                onValueChange={(value) =>
                                                    setHttpAuthMethod(
                                                        value as HttpAuthMethod,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="http-auth-method"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Select authorization method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NONE">
                                                        None
                                                    </SelectItem>
                                                    <SelectItem value="BEARER_TOKEN">
                                                        Bearer Token
                                                    </SelectItem>
                                                    <SelectItem value="API_KEY">
                                                        API Key Header
                                                    </SelectItem>
                                                    <SelectItem value="BASIC_AUTH">
                                                        Basic Auth
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {httpAuthMethod === "BEARER_TOKEN" ? (
                                        <div className="space-y-1.5">
                                            <Label htmlFor="http-bearer-token">
                                                Bearer Token
                                            </Label>
                                            <Input
                                                id="http-bearer-token"
                                                placeholder="Enter bearer token"
                                                value={httpAuthKey}
                                                onChange={(event) =>
                                                    setHttpAuthKey(
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    ) : null}

                                    {httpAuthMethod === "API_KEY" ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="http-api-key-header">
                                                    API Key Header Name
                                                </Label>
                                                <Input
                                                    id="http-api-key-header"
                                                    placeholder="X-API-Key"
                                                    value={httpApiKeyHeader}
                                                    onChange={(event) =>
                                                        setHttpApiKeyHeader(
                                                            event.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="http-api-key-value">
                                                    API Key
                                                </Label>
                                                <Input
                                                    id="http-api-key-value"
                                                    placeholder="Enter API key"
                                                    value={httpAuthKey}
                                                    onChange={(event) =>
                                                        setHttpAuthKey(
                                                            event.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ) : null}

                                    {httpAuthMethod === "BASIC_AUTH" ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="http-username">
                                                    Username
                                                </Label>
                                                <Input
                                                    id="http-username"
                                                    placeholder="integration-user"
                                                    value={httpUsername}
                                                    onChange={(event) =>
                                                        setHttpUsername(
                                                            event.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="http-password">
                                                    Password
                                                </Label>
                                                <Input
                                                    id="http-password"
                                                    type="password"
                                                    placeholder="Enter password"
                                                    value={httpPassword}
                                                    onChange={(event) =>
                                                        setHttpPassword(
                                                            event.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDownloadSamplePayload}
                                >
                                    Download Sample JSON
                                </Button>
                                <Button type="submit">
                                    Save Integration Settings
                                </Button>
                                {lastSavedAt ? (
                                    <p className="text-xs text-muted-foreground">
                                        Last saved: {lastSavedAt}
                                    </p>
                                ) : null}
                            </div>
                        </form>
                    </CardContent>
                </Card>
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
