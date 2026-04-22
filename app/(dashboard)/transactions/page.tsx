"use client";

import { useMemo, useState } from "react";
import { transactions } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { FullTransactionTable } from "@/components/transactions/FullTransactionTable";
import { AnomalyType, RiskLevel } from "@/types/transaction";
import { Download } from "lucide-react";

type RiskFilter = "ALL" | RiskLevel;
type AnomalyFilter = "ALL" | "NONE" | Exclude<AnomalyType, null>;

function downloadCsv(filename: string, rows: string[][]) {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

export default function TransactionsPage() {
    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] = useState<RiskFilter>("ALL");
    const [anomalyFilter, setAnomalyFilter] = useState<AnomalyFilter>("ALL");
    const [flaggedOnly, setFlaggedOnly] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return transactions.filter((txn) => {
            if (flaggedOnly && !txn.flagged) return false;
            if (riskFilter !== "ALL" && txn.riskLevel !== riskFilter)
                return false;

            if (anomalyFilter === "NONE" && txn.anomalyType !== null)
                return false;
            if (
                anomalyFilter !== "ALL" &&
                anomalyFilter !== "NONE" &&
                txn.anomalyType !== anomalyFilter
            ) {
                return false;
            }

            const txnDate = new Date(txn.timestamp);
            if (fromDate) {
                const from = new Date(`${fromDate}T00:00:00`);
                if (txnDate < from) return false;
            }

            if (toDate) {
                const to = new Date(`${toDate}T23:59:59`);
                if (txnDate > to) return false;
            }

            if (!query) return true;

            return (
                txn.id.toLowerCase().includes(query) ||
                txn.senderBank.toLowerCase().includes(query) ||
                txn.receiverBank.toLowerCase().includes(query) ||
                txn.senderLocation.toLowerCase().includes(query) ||
                txn.receiverLocation.toLowerCase().includes(query) ||
                (txn.anomalyType?.toLowerCase().includes(query) ?? false)
            );
        });
    }, [anomalyFilter, flaggedOnly, fromDate, riskFilter, search, toDate]);

    const summary = useMemo(() => {
        const totalAmount = filtered.reduce((sum, txn) => sum + txn.amount, 0);
        const avgRiskScore =
            filtered.length === 0
                ? 0
                : filtered.reduce((sum, txn) => sum + txn.riskScore, 0) /
                  filtered.length;
        const flaggedCount = filtered.filter((txn) => txn.flagged).length;

        return {
            totalAmount,
            avgRiskScore,
            flaggedCount,
        };
    }, [filtered]);

    const handleExportCsv = () => {
        const rows = [
            [
                "TXN ID",
                "Timestamp",
                "Amount (NGN)",
                "Sender Bank",
                "Receiver Bank",
                "Sender Location",
                "Receiver Location",
                "Velocity",
                "Risk Score",
                "Risk Level",
                "Anomaly",
                "Flagged",
            ],
            ...filtered.map((txn) => [
                txn.id,
                txn.timestamp,
                String(txn.amount),
                txn.senderBank,
                txn.receiverBank,
                txn.senderLocation,
                txn.receiverLocation,
                String(txn.velocity),
                String(txn.riskScore),
                txn.riskLevel,
                txn.anomalyType ?? "NONE",
                txn.flagged ? "YES" : "NO",
            ]),
        ];

        downloadCsv("transactions-export.csv", rows);
    };

    return (
        <div className="p-6 space-y-6">
            <section
                className="rounded-xl border p-4"
                style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                }}
            >
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-wider uppercase">
                            Full Transaction Log
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Searchable, sortable ledger of all transaction
                            events.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                                From
                            </p>
                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(event) =>
                                    setFromDate(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                                To
                            </p>
                            <Input
                                type="date"
                                value={toDate}
                                onChange={(event) =>
                                    setToDate(event.target.value)
                                }
                            />
                        </div>
                        <Button
                            onClick={handleExportCsv}
                            data-icon="inline-start"
                        >
                            <Download className="size-3.5" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </section>

            <TransactionFilters
                search={search}
                riskFilter={riskFilter}
                anomalyFilter={anomalyFilter}
                flaggedOnly={flaggedOnly}
                onSearchChange={setSearch}
                onRiskFilterChange={setRiskFilter}
                onAnomalyFilterChange={setAnomalyFilter}
                onFlaggedOnlyChange={setFlaggedOnly}
            />

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    size="sm"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-xs">
                            Total NGN Transacted
                        </CardTitle>
                    </CardHeader>
                    <CardContent
                        className="font-mono text-lg"
                        style={{ color: "var(--accent)" }}
                    >
                        {summary.totalAmount.toLocaleString("en-NG")}
                    </CardContent>
                </Card>
                <Card
                    size="sm"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-xs">
                            Average Risk Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent
                        className="font-mono text-lg"
                        style={{ color: "var(--yellow)" }}
                    >
                        {summary.avgRiskScore.toFixed(1)}
                    </CardContent>
                </Card>
                <Card
                    size="sm"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-xs">Flagged Count</CardTitle>
                    </CardHeader>
                    <CardContent
                        className="font-mono text-lg"
                        style={{ color: "var(--orange)" }}
                    >
                        {summary.flaggedCount}
                    </CardContent>
                </Card>
            </section>

            <FullTransactionTable rows={filtered} />
        </div>
    );
}
