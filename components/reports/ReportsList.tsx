"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface ReportRow {
    id: string;
    date: string;
    transactionId: string;
    status: "SUBMITTED" | "PENDING" | "REJECTED";
    jurisdiction: string;
}

interface ReportsListProps {
    rows: ReportRow[];
}

export function ReportsList({ rows }: ReportsListProps) {
    return (
        <div
            className="rounded-xl border overflow-hidden"
            style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
            }}
        >
            <Table>
                <TableHeader>
                    <TableRow style={{ background: "var(--surface-2)" }}>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>TXN ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Jurisdiction</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-xs">
                                {row.id}
                            </TableCell>
                            <TableCell className="text-xs">
                                {row.date}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                                {row.transactionId}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    style={{
                                        color:
                                            row.status === "SUBMITTED"
                                                ? "var(--green)"
                                                : row.status === "PENDING"
                                                  ? "var(--yellow)"
                                                  : "var(--red)",
                                        borderColor:
                                            row.status === "SUBMITTED"
                                                ? "var(--green)"
                                                : row.status === "PENDING"
                                                  ? "var(--yellow)"
                                                  : "var(--red)",
                                    }}
                                >
                                    {row.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                                {row.jurisdiction}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
