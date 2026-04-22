"use client";

import { useMemo, useState } from "react";
import { AnalysisDrawer } from "@/components/dashboard/AnalysisDrawer";
import { AlertQueue } from "@/components/flagged/AlertQueue";
import { flaggedTransactions } from "@/lib/data";
import { useAMLStore } from "@/lib/store";
import { AlertStatus, useAlertStore } from "@/lib/alert-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const STATUS_TABS: Array<{ label: string; value: "ALL" | AlertStatus }> = [
    { label: "All", value: "ALL" },
    { label: "New", value: "NEW" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Escalated", value: "ESCALATED" },
    { label: "Cleared", value: "CLEARED" },
];

export default function FlaggedPage() {
    const [activeStatus, setActiveStatus] = useState<"ALL" | AlertStatus>(
        "ALL",
    );
    const [anomalyFilter, setAnomalyFilter] = useState<string>("ALL");

    const setSelectedTransaction = useAMLStore(
        (state) => state.setSelectedTransaction,
    );
    const alertStatuses = useAlertStore((state) => state.alertStatuses);
    const setAlertStatus = useAlertStore((state) => state.setAlertStatus);

    const statusById = useMemo(
        () =>
            Object.fromEntries(
                flaggedTransactions.map((transaction) => [
                    transaction.id,
                    alertStatuses[transaction.id] ?? "NEW",
                ]),
            ) as Record<string, AlertStatus>,
        [alertStatuses],
    );

    const openAlertsCount = useMemo(
        () =>
            Object.values(statusById).filter((status) => status !== "CLEARED")
                .length,
        [statusById],
    );

    const filteredAlerts = useMemo(() => {
        return flaggedTransactions.filter((transaction) => {
            const status = statusById[transaction.id];
            const statusMatch =
                activeStatus === "ALL" || status === activeStatus;
            const anomalyMatch =
                anomalyFilter === "ALL" ||
                (anomalyFilter === "NONE" &&
                    transaction.anomalyType === null) ||
                transaction.anomalyType === anomalyFilter;
            return statusMatch && anomalyMatch;
        });
    }, [activeStatus, anomalyFilter, statusById]);

    return (
        <>
            <AnalysisDrawer />

            <div className="p-6 space-y-6">
                <section
                    className="rounded-xl border p-4 space-y-4"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--surface)",
                    }}
                >
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold tracking-wider uppercase">
                                Flagged Alerts Queue
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                {openAlertsCount} open alerts out of{" "}
                                {flaggedTransactions.length} flagged
                                transactions.
                            </p>
                        </div>

                        <div className="w-60">
                            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                                Anomaly Filter
                            </p>
                            <Select
                                value={anomalyFilter}
                                onValueChange={setAnomalyFilter}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filter anomaly" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All anomalies
                                    </SelectItem>
                                    <SelectItem value="NONE">None</SelectItem>
                                    <SelectItem value="SMURFING">
                                        Smurfing
                                    </SelectItem>
                                    <SelectItem value="VELOCITY_SPIKE">
                                        Velocity spike
                                    </SelectItem>
                                    <SelectItem value="GEO_ANOMALY">
                                        Geo anomaly
                                    </SelectItem>
                                    <SelectItem value="ROUND_TRIPPING">
                                        Round tripping
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Tabs
                        value={activeStatus}
                        onValueChange={(value) =>
                            setActiveStatus(value as "ALL" | AlertStatus)
                        }
                    >
                        <TabsList
                            variant="line"
                            className="w-full justify-start overflow-auto"
                        >
                            {STATUS_TABS.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </section>

                <AlertQueue
                    transactions={filteredAlerts}
                    statusByTransactionId={statusById}
                    onOpenTransaction={setSelectedTransaction}
                    onStatusChange={setAlertStatus}
                />
            </div>
        </>
    );
}
