"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AnomalyType, RiskLevel } from "@/types/transaction";

type RiskFilter = "ALL" | RiskLevel;
type AnomalyFilter = "ALL" | "NONE" | Exclude<AnomalyType, null>;

interface TransactionFiltersProps {
    search: string;
    riskFilter: RiskFilter;
    anomalyFilter: AnomalyFilter;
    flaggedOnly: boolean;
    onSearchChange: (value: string) => void;
    onRiskFilterChange: (value: RiskFilter) => void;
    onAnomalyFilterChange: (value: AnomalyFilter) => void;
    onFlaggedOnlyChange: (value: boolean) => void;
}

const RISK_FILTERS: RiskFilter[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

const RISK_COLORS: Record<RiskFilter, string> = {
    ALL: "var(--accent)",
    CRITICAL: "var(--red)",
    HIGH: "var(--orange)",
    MEDIUM: "var(--yellow)",
    LOW: "var(--green)",
};

export function TransactionFilters({
    search,
    riskFilter,
    anomalyFilter,
    flaggedOnly,
    onSearchChange,
    onRiskFilterChange,
    onAnomalyFilterChange,
    onFlaggedOnlyChange,
}: TransactionFiltersProps) {
    return (
        <div
            className="rounded-xl border p-4 space-y-4"
            style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
            }}
        >
            <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-55 flex-1">
                    <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                        Search
                    </p>
                    <Input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="TXN ID, bank, location, anomaly"
                    />
                </div>

                <div className="w-55">
                    <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                        Anomaly
                    </p>
                    <Select
                        value={anomalyFilter}
                        onValueChange={(value) =>
                            onAnomalyFilterChange(value as AnomalyFilter)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select anomaly" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All anomalies</SelectItem>
                            <SelectItem value="NONE">None</SelectItem>
                            <SelectItem value="SMURFING">Smurfing</SelectItem>
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

                <label className="inline-flex items-center gap-2.5 pb-1">
                    <Checkbox
                        checked={flaggedOnly}
                        onCheckedChange={(checked) =>
                            onFlaggedOnlyChange(Boolean(checked))
                        }
                        aria-label="Toggle flagged only"
                    />
                    <span className="text-xs font-semibold tracking-wider uppercase text-foreground/90">
                        Flagged only
                    </span>
                </label>
            </div>

            <div className="flex flex-wrap gap-2">
                {RISK_FILTERS.map((level) => (
                    <Button
                        key={level}
                        size="xs"
                        variant="outline"
                        style={{
                            borderColor:
                                riskFilter === level
                                    ? RISK_COLORS[level]
                                    : "var(--border)",
                            background:
                                riskFilter === level
                                    ? `color-mix(in srgb, ${RISK_COLORS[level]} 14%, transparent)`
                                    : "transparent",
                            color:
                                riskFilter === level
                                    ? RISK_COLORS[level]
                                    : "var(--text-3)",
                        }}
                        onClick={() => onRiskFilterChange(level)}
                    >
                        {level}
                    </Button>
                ))}
            </div>
        </div>
    );
}
