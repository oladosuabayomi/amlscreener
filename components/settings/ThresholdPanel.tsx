"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ThresholdPanel() {
    const [velocityThreshold, setVelocityThreshold] = useState(12);
    const [riskScoreCutoff, setRiskScoreCutoff] = useState(70);
    const [minFlagAmount, setMinFlagAmount] = useState(500000);

    return (
        <Card
            style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
            }}
        >
            <CardHeader>
                <CardTitle className="text-sm">Alert Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="velocity-threshold">
                        Velocity threshold (txns/hr)
                    </Label>
                    <Input
                        id="velocity-threshold"
                        type="number"
                        value={velocityThreshold}
                        onChange={(event) =>
                            setVelocityThreshold(Number(event.target.value))
                        }
                        min={1}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="risk-cutoff">Risk score cutoff</Label>
                    <Input
                        id="risk-cutoff"
                        type="number"
                        value={riskScoreCutoff}
                        onChange={(event) =>
                            setRiskScoreCutoff(Number(event.target.value))
                        }
                        min={1}
                        max={100}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="min-flag-amount">
                        Minimum flagging amount (NGN)
                    </Label>
                    <Input
                        id="min-flag-amount"
                        type="number"
                        value={minFlagAmount}
                        onChange={(event) =>
                            setMinFlagAmount(Number(event.target.value))
                        }
                        min={0}
                        step={5000}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
