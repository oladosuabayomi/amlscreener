"use client";

import { Transaction } from "@/types/transaction";
import { AlertStatus } from "@/lib/alert-store";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AlertCardProps {
    transaction: Transaction;
    status: AlertStatus;
    onOpen: (transaction: Transaction) => void;
    onStatusChange: (id: string, status: AlertStatus) => void;
}

const RISK_COLORS: Record<Transaction["riskLevel"], string> = {
    LOW: "#22c55e",
    MEDIUM: "#eab308",
    HIGH: "#f97316",
    CRITICAL: "#ef4444",
};

export function AlertCard({
    transaction,
    status,
    onOpen,
    onStatusChange,
}: AlertCardProps) {
    const severityColor = RISK_COLORS[transaction.riskLevel];

    return (
        <Card
            size="sm"
            className="cursor-pointer border"
            onClick={() => onOpen(transaction)}
            style={{
                borderColor: "var(--border)",
                borderLeft: `3px solid ${severityColor}`,
                background: "var(--surface)",
            }}
        >
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <CardTitle className="text-sm">
                            {transaction.id}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            {transaction.senderLocation} {"->"}{" "}
                            {transaction.receiverLocation}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-sm">
                            NGN {transaction.amount.toLocaleString("en-NG")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString(
                                "en-NG",
                            )}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="destructive"
                        className="font-mono"
                        style={{ color: severityColor }}
                    >
                        {transaction.riskLevel}
                    </Badge>
                    <Badge variant="secondary" className="font-mono">
                        {transaction.anomalyType ?? "UNCLASSIFIED"}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                        {status}
                    </Badge>
                </div>

                <div className="space-y-1">
                    <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Severity
                    </p>
                    <div className="h-2 bg-muted">
                        <div
                            className="h-2"
                            style={{
                                width: `${transaction.riskScore}%`,
                                backgroundColor: severityColor,
                            }}
                        />
                    </div>
                    <p className="text-xs font-mono text-muted-foreground">
                        Risk score: {transaction.riskScore}/100
                    </p>
                </div>
            </CardContent>

            <CardFooter
                className="gap-2 flex-wrap border-t"
                style={{ borderColor: "var(--border)" }}
            >
                <Button
                    size="xs"
                    variant="outline"
                    style={{
                        borderColor:
                            status === "UNDER_REVIEW"
                                ? "var(--accent)"
                                : "var(--border)",
                        color:
                            status === "UNDER_REVIEW"
                                ? "var(--accent)"
                                : "var(--text-2)",
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onStatusChange(transaction.id, "UNDER_REVIEW");
                    }}
                >
                    Mark Reviewed
                </Button>
                <Button
                    size="xs"
                    variant="outline"
                    style={{
                        borderColor:
                            status === "ESCALATED"
                                ? "var(--red)"
                                : "var(--border)",
                        color:
                            status === "ESCALATED"
                                ? "var(--red)"
                                : "var(--text-2)",
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onStatusChange(transaction.id, "ESCALATED");
                    }}
                >
                    Escalate
                </Button>
                <Button
                    size="xs"
                    variant="outline"
                    style={{
                        borderColor:
                            status === "CLEARED"
                                ? "var(--green)"
                                : "var(--border)",
                        color:
                            status === "CLEARED"
                                ? "var(--green)"
                                : "var(--text-2)",
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onStatusChange(transaction.id, "CLEARED");
                    }}
                >
                    Clear
                </Button>
            </CardFooter>
        </Card>
    );
}
