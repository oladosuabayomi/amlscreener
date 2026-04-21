"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function NotificationPanel() {
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [inAppEnabled, setInAppEnabled] = useState(true);
    const [escalationEnabled, setEscalationEnabled] = useState(true);

    return (
        <Card
            style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
            }}
        >
            <CardHeader>
                <CardTitle className="text-sm">
                    Notification Preferences
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <label
                    className="flex items-center justify-between gap-3 border p-3"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--surface-2)",
                    }}
                >
                    <div>
                        <p className="text-sm font-medium">Email alerts</p>
                        <p className="text-xs text-muted-foreground">
                            Send compliance alerts by email.
                        </p>
                    </div>
                    <Checkbox
                        checked={emailEnabled}
                        onCheckedChange={(checked) =>
                            setEmailEnabled(Boolean(checked))
                        }
                    />
                </label>

                <label
                    className="flex items-center justify-between gap-3 border p-3"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--surface-2)",
                    }}
                >
                    <div>
                        <p className="text-sm font-medium">In-app alerts</p>
                        <p className="text-xs text-muted-foreground">
                            Display real-time alerts in dashboard.
                        </p>
                    </div>
                    <Checkbox
                        checked={inAppEnabled}
                        onCheckedChange={(checked) =>
                            setInAppEnabled(Boolean(checked))
                        }
                    />
                </label>

                <label
                    className="flex items-center justify-between gap-3 border p-3"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--surface-2)",
                    }}
                >
                    <div>
                        <p className="text-sm font-medium">
                            Escalation notices
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Notify senior compliance officers on escalations.
                        </p>
                    </div>
                    <Checkbox
                        checked={escalationEnabled}
                        onCheckedChange={(checked) =>
                            setEscalationEnabled(Boolean(checked))
                        }
                    />
                </label>
            </CardContent>
        </Card>
    );
}
