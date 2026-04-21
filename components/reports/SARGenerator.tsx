"use client";

import { useMemo, useState } from "react";
import { flaggedTransactions } from "@/lib/data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SARGenerator() {
    const [selectedTransactionId, setSelectedTransactionId] = useState("");
    const [generatedAt, setGeneratedAt] = useState<string | null>(null);

    const selectedTransaction = useMemo(
        () =>
            flaggedTransactions.find(
                (transaction) => transaction.id === selectedTransactionId,
            ) ?? null,
        [selectedTransactionId],
    );

    const handleGenerate = () => {
        if (!selectedTransactionId) return;
        setGeneratedAt(new Date().toLocaleString("en-NG"));
    };

    return (
        <Card
            style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
            }}
        >
            <CardHeader>
                <CardTitle className="text-sm">Quick SAR Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-55 flex-1">
                        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                            Flagged Transaction
                        </p>
                        <Select
                            value={selectedTransactionId}
                            onValueChange={setSelectedTransactionId}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select flagged transaction" />
                            </SelectTrigger>
                            <SelectContent>
                                {flaggedTransactions.map((transaction) => (
                                    <SelectItem
                                        key={transaction.id}
                                        value={transaction.id}
                                    >
                                        {transaction.id} -{" "}
                                        {transaction.anomalyType ??
                                            "UNCLASSIFIED"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!selectedTransactionId}
                    >
                        Generate SAR Preview
                    </Button>
                </div>

                {selectedTransaction && generatedAt ? (
                    <div
                        className="border p-4 space-y-3"
                        style={{
                            borderColor: "var(--border)",
                            background: "var(--surface-2)",
                        }}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xs font-semibold tracking-widest uppercase">
                                SAR Preview
                            </h3>
                            <Badge variant="outline">Draft</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Generated: {generatedAt}
                        </p>
                        <p className="text-sm font-medium">
                            Transaction: {selectedTransaction.id}
                        </p>
                        <p className="text-sm">
                            Anomaly:{" "}
                            {selectedTransaction.anomalyType ?? "UNCLASSIFIED"}
                        </p>
                        <p className="text-sm">
                            Risk level: {selectedTransaction.riskLevel} (
                            {selectedTransaction.riskScore}/100)
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Regulatory references: FATF Recommendation 20, CBN
                            AML/CFT Circular 2023/07, NFIU STR template
                            guidance.
                        </p>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
