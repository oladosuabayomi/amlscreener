"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { ArrowDownUp } from "lucide-react";

type SortDirection = "asc" | "desc";
type SortKey =
    | "id"
    | "timestamp"
    | "amount"
    | "senderBank"
    | "route"
    | "velocity"
    | "riskScore"
    | "riskLevel"
    | "status";

interface FullTransactionTableProps {
    rows: Transaction[];
}

const PAGE_SIZE = 25;
const RISK_ORDER: Record<Transaction["riskLevel"], number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4,
};

const RISK_TINT: Record<Transaction["riskLevel"], string> = {
    LOW: "rgba(34,197,94,0.04)",
    MEDIUM: "rgba(234,179,8,0.05)",
    HIGH: "rgba(249,115,22,0.07)",
    CRITICAL: "rgba(239,68,68,0.09)",
};

function compareValues(a: Transaction, b: Transaction, key: SortKey) {
    switch (key) {
        case "id":
            return a.id.localeCompare(b.id);
        case "timestamp":
            return (
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            );
        case "amount":
            return a.amount - b.amount;
        case "senderBank":
            return a.senderBank.localeCompare(b.senderBank);
        case "route":
            return `${a.senderLocation} ${a.receiverLocation}`.localeCompare(
                `${b.senderLocation} ${b.receiverLocation}`,
            );
        case "velocity":
            return a.velocity - b.velocity;
        case "riskScore":
            return a.riskScore - b.riskScore;
        case "riskLevel":
            return RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel];
        case "status":
            return Number(a.flagged) - Number(b.flagged);
        default:
            return 0;
    }
}

export function FullTransactionTable({ rows }: FullTransactionTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>("timestamp");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [rows]);

    const sortedRows = useMemo(() => {
        const cloned = [...rows];
        cloned.sort((a, b) => {
            const base = compareValues(a, b, sortKey);
            return sortDirection === "asc" ? base : -base;
        });
        return cloned;
    }, [rows, sortDirection, sortKey]);

    const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const visible = sortedRows.slice(start, start + PAGE_SIZE);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortKey(key);
        setSortDirection("asc");
    };

    const sortButton = (label: string, key: SortKey) => (
        <Button
            variant="ghost"
            size="xs"
            onClick={() => toggleSort(key)}
            className="font-mono"
        >
            {label}
            <ArrowDownUp className="size-3" />
        </Button>
    );

    return (
        <div
            className="rounded-xl border overflow-hidden"
            style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
            }}
        >
            <div className="overflow-x-auto">
                <Table className="min-w-245">
                    <TableHeader>
                        <TableRow style={{ background: "var(--surface-2)" }}>
                            <TableHead style={{ color: "var(--text-3)" }}>
                                {sortButton("TXN ID", "id")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Time", "timestamp")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Amount (NGN)", "amount")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Sender", "senderBank")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Origin -> Dest", "route")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Vel/HR", "velocity")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Risk Score", "riskScore")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Level", "riskLevel")}
                            </TableHead>
                            <TableHead>
                                {sortButton("Status", "status")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {visible.map((txn) => (
                            <TableRow
                                key={txn.id}
                                style={{
                                    background: txn.flagged
                                        ? RISK_TINT[txn.riskLevel]
                                        : "transparent",
                                }}
                            >
                                <TableCell className="font-mono text-xs">
                                    {txn.id}
                                </TableCell>
                                <TableCell className="text-xs">
                                    {new Date(txn.timestamp).toLocaleString(
                                        "en-NG",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        },
                                    )}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {txn.amount.toLocaleString("en-NG")}
                                </TableCell>
                                <TableCell className="text-xs">
                                    {txn.senderBank}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {txn.senderLocation} {"->"}{" "}
                                    {txn.receiverLocation}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {txn.velocity}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {txn.riskScore}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className="font-mono"
                                        variant={
                                            txn.riskLevel === "CRITICAL"
                                                ? "destructive"
                                                : "secondary"
                                        }
                                    >
                                        {txn.riskLevel}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            txn.flagged
                                                ? "destructive"
                                                : "ghost"
                                        }
                                    >
                                        {txn.flagged ? "FLAGGED" : "CLEAR"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div
                className="flex items-center justify-between px-4 py-3 border-t"
                style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-2)",
                }}
            >
                <p className="text-xs text-muted-foreground">
                    Showing {visible.length === 0 ? 0 : start + 1}-
                    {Math.min(start + PAGE_SIZE, sortedRows.length)} of{" "}
                    {sortedRows.length}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        size="xs"
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    >
                        Prev
                    </Button>
                    <span className="text-xs font-mono text-muted-foreground">
                        Page {page} / {totalPages}
                    </span>
                    <Button
                        size="xs"
                        variant="outline"
                        disabled={page >= totalPages}
                        onClick={() =>
                            setPage((prev) => Math.min(totalPages, prev + 1))
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
