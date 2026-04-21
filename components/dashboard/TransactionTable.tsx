"use client";

import { useState, useMemo } from "react";
import { useAMLStore } from "@/lib/store";
import { transactions } from "@/lib/data";
import { Transaction, RiskLevel } from "@/types/transaction";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RISK_COLORS: Record<
    RiskLevel,
    { fg: string; bg: string; border: string }
> = {
    LOW: {
        fg: "#22c55e",
        bg: "rgba(34,197,94,0.1)",
        border: "rgba(34,197,94,0.25)",
    },
    MEDIUM: {
        fg: "#eab308",
        bg: "rgba(234,179,8,0.1)",
        border: "rgba(234,179,8,0.25)",
    },
    HIGH: {
        fg: "#f97316",
        bg: "rgba(249,115,22,0.1)",
        border: "rgba(249,115,22,0.25)",
    },
    CRITICAL: {
        fg: "#ef4444",
        bg: "rgba(239,68,68,0.1)",
        border: "rgba(239,68,68,0.25)",
    },
};

type FilterLevel = "ALL" | RiskLevel;

function RiskBadge({ level }: { level: RiskLevel }) {
    const c = RISK_COLORS[level];
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold tracking-wider"
            style={{
                color: c.fg,
                backgroundColor: c.bg,
                border: `1px solid ${c.border}`,
            }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: c.fg }}
            />
            {level}
        </span>
    );
}

export function TransactionTable() {
    const { setSelectedTransaction, selectedTransaction } = useAMLStore();
    const [search, setSearch] = useState("");
    const [filterLevel, setFilterLevel] = useState<FilterLevel>("ALL");

    const filterLevels: FilterLevel[] = [
        "ALL",
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW",
    ];

    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const matchLevel =
                filterLevel === "ALL" || t.riskLevel === filterLevel;
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                t.id.toLowerCase().includes(q) ||
                t.senderBank.toLowerCase().includes(q) ||
                t.receiverBank.toLowerCase().includes(q) ||
                t.senderLocation.toLowerCase().includes(q) ||
                t.receiverLocation.toLowerCase().includes(q) ||
                (t.anomalyType?.toLowerCase().includes(q) ?? false);
            return matchLevel && matchSearch;
        });
    }, [search, filterLevel]);

    return (
        <div
            className="overflow-hidden flex flex-col"
            style={{
                border: "1px solid var(--border)",
                background: "var(--surface)",
            }}
        >
            {/* Header */}
            <div
                className="px-4 py-3 flex items-center justify-between shrink-0"
                style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface-2)",
                }}
            >
                <div>
                    <h2
                        className="font-mono text-[11px] font-semibold tracking-widest uppercase"
                        style={{ color: "var(--text-1)" }}
                    >
                        Transaction Log
                    </h2>
                </div>
                <span
                    className="font-mono text-[10px]"
                    style={{ color: "var(--text-3)" }}
                >
                    {filtered.length} / {transactions.length} records
                </span>
            </div>

            {/* Filter Bar */}
            <div
                className="px-4 py-2.5 flex items-center gap-3 flex-wrap shrink-0"
                style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface)",
                }}
            >
                <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 w-48 font-mono text-[11px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    style={{
                        color: "var(--text-2)",
                        borderBottom: "1px solid var(--border)",
                        borderRadius: 0,
                    }}
                />
                <div className="flex items-center gap-1.5">
                    {filterLevels.map((level) => {
                        const active = filterLevel === level;
                        const color =
                            level === "ALL"
                                ? "#3b82f6"
                                : RISK_COLORS[level as RiskLevel].fg;
                        return (
                            <button
                                key={level}
                                onClick={() => setFilterLevel(level)}
                                className="font-mono text-[9px] font-semibold tracking-widest px-2.5 py-1 rounded-full transition-all"
                                style={{
                                    border: `1px solid ${active ? color : "var(--border)"}`,
                                    background: active
                                        ? `${color}20`
                                        : "transparent",
                                    color: active ? color : "var(--text-3)",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                {level}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Scrollable Table — horizontal on small screens, vertical via ScrollArea */}
            <div
                className="overflow-x-auto"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                <ScrollArea className="flex-1 h-105">
                    <Table className="min-w-200">
                        <TableHeader>
                            <TableRow
                                className="border-0 hover:bg-transparent"
                                style={{
                                    borderBottom: "1px solid var(--border)",
                                    background: "var(--surface-2)",
                                }}
                            >
                                {[
                                    "TXN ID",
                                    "TIME",
                                    "AMOUNT (NGN)",
                                    "SENDER",
                                    "ORIGIN → DEST",
                                    "VEL/HR",
                                    "RISK SCORE",
                                    "LEVEL",
                                    "STATUS",
                                ].map((h) => (
                                    <TableHead
                                        key={h}
                                        className="font-mono text-[9px] font-semibold tracking-widest uppercase h-9 whitespace-nowrap"
                                        style={{ color: "var(--text-3)" }}
                                    >
                                        {h}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((txn) => {
                                const isSelected =
                                    selectedTransaction?.id === txn.id;
                                const isCritical = txn.riskLevel === "CRITICAL";
                                const isHigh = txn.riskLevel === "HIGH";
                                const velColor =
                                    txn.velocity > 12
                                        ? "#ef4444"
                                        : txn.velocity > 6
                                          ? "#f97316"
                                          : "#22c55e";
                                const scoreColor =
                                    txn.riskScore > 80
                                        ? "#ef4444"
                                        : txn.riskScore > 50
                                          ? "#f97316"
                                          : txn.riskScore > 25
                                            ? "#eab308"
                                            : "#22c55e";

                                return (
                                    <TableRow
                                        key={txn.id}
                                        onClick={() =>
                                            txn.flagged &&
                                            setSelectedTransaction(txn)
                                        }
                                        className="border-0 transition-colors duration-150"
                                        style={{
                                            borderBottom:
                                                "1px solid var(--border)",
                                            cursor: txn.flagged
                                                ? "pointer"
                                                : "default",
                                            background: isSelected
                                                ? "rgba(239,68,68,0.12)"
                                                : isCritical
                                                  ? "rgba(239,68,68,0.05)"
                                                  : isHigh
                                                    ? "rgba(249,115,22,0.03)"
                                                    : "transparent",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected)
                                                (
                                                    e.currentTarget as HTMLElement
                                                ).style.background =
                                                    "var(--surface-2)";
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background = isSelected
                                                ? "rgba(239,68,68,0.12)"
                                                : isCritical
                                                  ? "rgba(239,68,68,0.05)"
                                                  : isHigh
                                                    ? "rgba(249,115,22,0.03)"
                                                    : "transparent";
                                        }}
                                    >
                                        <TableCell
                                            className="font-mono text-[10px] py-2.5"
                                            style={{ color: "var(--text-3)" }}
                                        >
                                            {txn.id}
                                        </TableCell>
                                        <TableCell
                                            className="font-mono text-[11px] py-2.5"
                                            style={{ color: "var(--text-2)" }}
                                        >
                                            {new Date(
                                                txn.timestamp,
                                            ).toLocaleTimeString("en-NG", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </TableCell>
                                        <TableCell
                                            className="font-mono text-[11px] py-2.5 font-medium whitespace-nowrap"
                                            style={{ color: "var(--text-1)" }}
                                        >
                                            ₦
                                            {txn.amount.toLocaleString("en-NG")}
                                        </TableCell>
                                        <TableCell
                                            className="text-[11px] py-2.5"
                                            style={{ color: "var(--text-2)" }}
                                        >
                                            {txn.senderBank}
                                        </TableCell>
                                        <TableCell
                                            className="text-[10px] py-2.5 max-w-45 truncate"
                                            style={{ color: "var(--text-3)" }}
                                        >
                                            {txn.senderLocation} →{" "}
                                            {txn.receiverLocation}
                                        </TableCell>
                                        <TableCell
                                            className="font-mono text-[11px] py-2.5 font-semibold"
                                            style={{ color: velColor }}
                                        >
                                            {txn.velocity}/hr
                                        </TableCell>
                                        <TableCell
                                            className="font-mono text-[11px] py-2.5 font-semibold"
                                            style={{ color: scoreColor }}
                                        >
                                            {txn.riskScore}
                                        </TableCell>
                                        <TableCell className="py-2.5">
                                            <RiskBadge level={txn.riskLevel} />
                                        </TableCell>
                                        <TableCell className="py-2.5">
                                            {txn.flagged ? (
                                                <span
                                                    className="font-mono text-[10px] font-semibold"
                                                    style={{ color: "#ef4444" }}
                                                >
                                                    ⚠ FLAGGED
                                                </span>
                                            ) : (
                                                <span
                                                    className="text-[11px]"
                                                    style={{
                                                        color: "var(--text-3)",
                                                    }}
                                                >
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
