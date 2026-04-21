"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsList, ReportRow } from "@/components/reports/ReportsList";
import { SARGenerator } from "@/components/reports/SARGenerator";
import { RegulatoryCards } from "@/components/reports/RegulatoryCards";

const REPORT_ROWS: ReportRow[] = [
    {
        id: "SAR-2026-001",
        date: "2026-04-16",
        transactionId: "TXN-061",
        status: "SUBMITTED",
        jurisdiction: "NFIU / NG",
    },
    {
        id: "SAR-2026-002",
        date: "2026-04-16",
        transactionId: "TXN-062",
        status: "SUBMITTED",
        jurisdiction: "CBN / NG",
    },
    {
        id: "SAR-2026-003",
        date: "2026-04-17",
        transactionId: "TXN-067",
        status: "PENDING",
        jurisdiction: "NFIU / NG",
    },
    {
        id: "SAR-2026-004",
        date: "2026-04-18",
        transactionId: "TXN-070",
        status: "REJECTED",
        jurisdiction: "CBN / NG",
    },
    {
        id: "SAR-2026-005",
        date: "2026-04-19",
        transactionId: "TXN-073",
        status: "PENDING",
        jurisdiction: "NFIU / NG",
    },
];

const KPI_ITEMS = [
    { label: "STRs Filed", value: "28", color: "var(--accent)" },
    { label: "Accounts Frozen", value: "6", color: "var(--red)" },
    { label: "Avg Resolution Time", value: "14.2h", color: "var(--orange)" },
    { label: "Compliance Score", value: "94.7%", color: "var(--green)" },
];

export default function ReportsPage() {
    return (
        <div className="p-6 space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {KPI_ITEMS.map((item) => (
                    <Card
                        size="sm"
                        key={item.label}
                        style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <CardHeader>
                            <CardTitle className="text-xs">
                                {item.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent
                            className="font-mono text-lg"
                            style={{ color: item.color }}
                        >
                            {item.value}
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold tracking-widest uppercase">
                    Generated Reports
                </h2>
                <ReportsList rows={REPORT_ROWS} />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
                <SARGenerator />
                <RegulatoryCards />
            </section>
        </div>
    );
}
