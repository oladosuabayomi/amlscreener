"use client";

import { AlertStatus } from "@/lib/alert-store";
import { Transaction } from "@/types/transaction";
import { AlertCard } from "@/components/flagged/AlertCard";

interface AlertQueueProps {
    transactions: Transaction[];
    statusByTransactionId: Record<string, AlertStatus>;
    onOpenTransaction: (transaction: Transaction) => void;
    onStatusChange: (id: string, status: AlertStatus) => void;
}

export function AlertQueue({
    transactions,
    statusByTransactionId,
    onOpenTransaction,
    onStatusChange,
}: AlertQueueProps) {
    if (transactions.length === 0) {
        return (
            <div
                className="rounded-xl border p-8 text-center"
                style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                }}
            >
                <p className="text-xs tracking-wider uppercase text-muted-foreground">
                    No alerts match your filters.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {transactions.map((transaction) => (
                <AlertCard
                    key={transaction.id}
                    transaction={transaction}
                    status={statusByTransactionId[transaction.id]}
                    onOpen={onOpenTransaction}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
}
