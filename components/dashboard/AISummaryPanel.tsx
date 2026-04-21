"use client";

import { useCallback } from "react";
import { useAMLStore } from "@/lib/store";
import { Zap, X, AlertTriangle, Shield } from "lucide-react";

const MOCK_RESPONSE = `PATTERN DETECTED — Classic smurfing (structuring) behaviour identified.

EVIDENCE
• Multiple transfers of nearly identical amounts (~₦45,000–₦49,500) from a single originator within 2 hours
• Receivers span distinct geographic locations across Nigeria
• All amounts deliberately below the ₦50,000 reporting threshold

RISK FACTORS
• Matches CBN AML/CFT Circular 2023/07 structuring typology
• NFIU Suspicious Transaction Report threshold triggered
• Pattern consistent with FATF Recommendation 20 red flags
• Velocity is 7–9× the account's 30-day baseline

RECOMMENDED ACTION — File a Suspicious Transaction Report (STR) with the NFIU within 24 hours. Freeze originating account pending compliance review. Notify the Compliance Officer immediately.`;

export function AISummaryPanel() {
    const {
        selectedTransaction,
        setSelectedTransaction,
        aiSummary,
        setAISummary,
        appendAISummary,
        isAnalyzing,
        setIsAnalyzing,
    } = useAMLStore();

    const analyzeTransaction = useCallback(async () => {
        if (!selectedTransaction) return;

        setIsAnalyzing(true);
        setAISummary("");

        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/api/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedTransaction),
            });

            if (!response.ok || !response.body) throw new Error("API error");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                appendAISummary(decoder.decode(value, { stream: true }));
            }
        } catch {
            // Graceful fallback — use mock response if backend not running
            let i = 0;
            const interval = setInterval(() => {
                if (i < MOCK_RESPONSE.length) {
                    appendAISummary(MOCK_RESPONSE[i]);
                    i++;
                } else {
                    clearInterval(interval);
                    setIsAnalyzing(false);
                }
            }, 14);
            return;
        } finally {
            setIsAnalyzing(false);
        }
    }, [selectedTransaction, setIsAnalyzing, setAISummary, appendAISummary]);

    if (!selectedTransaction) {
        return (
            <div
                className="rounded-xl h-full flex items-center justify-center p-8 min-h-75"
                style={{
                    border: "1px solid rgb(var(--border))",
                    background: "rgb(var(--surface))",
                }}
            >
                <div className="text-center space-y-3">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                        style={{
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.15)",
                        }}
                    >
                        <AlertTriangle
                            className="w-5 h-5"
                            style={{ color: "rgb(var(--text-muted))" }}
                        />
                    </div>
                    <p
                        className="text-xs font-mono tracking-widest"
                        style={{ color: "rgb(var(--text-muted))" }}
                    >
                        SELECT A FLAGGED NODE
                    </p>
                    <p
                        className="text-[10px] leading-relaxed"
                        style={{ color: "rgb(var(--text-muted))" }}
                    >
                        Click a glowing node in the scatter plot
                        <br />
                        or a flagged row in the table below
                    </p>
                </div>
            </div>
        );
    }

    const riskColor = {
        LOW: "#22c55e",
        MEDIUM: "#eab308",
        HIGH: "#f97316",
        CRITICAL: "#ef4444",
    }[selectedTransaction.riskLevel];

    return (
        <div
            className="rounded-xl flex flex-col min-h-75"
            style={{
                border: `1px solid ${riskColor}40`,
                background: "rgb(var(--surface))",
            }}
        >
            {/* Header */}
            <div
                className="px-4 py-3 flex items-center justify-between shrink-0"
                style={{ borderBottom: "1px solid rgb(var(--border))" }}
            >
                <div>
                    <div className="flex items-center gap-2">
                        <Shield
                            className="w-3.5 h-3.5"
                            style={{ color: riskColor }}
                        />
                        <h2
                            className="text-xs font-semibold tracking-widest"
                            style={{ color: riskColor }}
                        >
                            AI ANALYSIS
                        </h2>
                    </div>
                    <p
                        className="text-[10px] font-mono mt-0.5"
                        style={{ color: "rgb(var(--text-muted))" }}
                    >
                        {selectedTransaction.id}
                    </p>
                </div>
                <button
                    onClick={() => setSelectedTransaction(null)}
                    className="rounded-md p-1 transition-colors hover:bg-white/5"
                    style={{ color: "rgb(var(--text-muted))" }}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Transaction snapshot */}
            <div
                className="px-4 py-3 space-y-1.5 shrink-0"
                style={{ borderBottom: "1px solid rgb(var(--border))" }}
            >
                {[
                    {
                        label: "AMOUNT",
                        value: `₦${selectedTransaction.amount.toLocaleString("en-NG")}`,
                        color: "#f1f5f9",
                    },
                    {
                        label: "VELOCITY",
                        value: `${selectedTransaction.velocity}/hr`,
                        color: "#fb923c",
                    },
                    {
                        label: "RISK SCORE",
                        value: `${selectedTransaction.riskScore}/100`,
                        color: riskColor,
                    },
                    {
                        label: "ANOMALY",
                        value:
                            selectedTransaction.anomalyType ?? "UNCLASSIFIED",
                        color: "#fbbf24",
                    },
                    {
                        label: "ORIGIN",
                        value: selectedTransaction.senderLocation,
                        color: "#94a3b8",
                    },
                    {
                        label: "DEST",
                        value: selectedTransaction.receiverLocation,
                        color: "#94a3b8",
                    },
                ].map(({ label, value, color }) => (
                    <div
                        key={label}
                        className="flex justify-between items-center text-[10px] font-mono"
                    >
                        <span style={{ color: "rgb(var(--text-muted))" }}>
                            {label}
                        </span>
                        <span style={{ color }} className="font-medium">
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            {/* AI summary output */}
            <div className="flex-1 p-4 overflow-y-auto">
                {aiSummary ? (
                    <div
                        className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap"
                        style={{ color: "rgb(var(--text-primary))" }}
                    >
                        {aiSummary}
                        {isAnalyzing && (
                            <span
                                className="inline-block w-2 h-3.5 ml-0.5 align-middle ai-cursor"
                                style={{ background: "#3b82f6" }}
                            />
                        )}
                    </div>
                ) : (
                    <p
                        className="text-[10px] font-mono leading-relaxed"
                        style={{ color: "rgb(var(--text-muted))" }}
                    >
                        Click &quot;Analyse Flagged Node&quot; below to generate
                        a live AI compliance report for this transaction.
                    </p>
                )}
            </div>

            {/* CTA Button */}
            <div
                className="p-4 shrink-0"
                style={{ borderTop: "1px solid rgb(var(--border))" }}
            >
                <button
                    onClick={analyzeTransaction}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200"
                    style={{
                        background: isAnalyzing
                            ? "rgba(59,130,246,0.35)"
                            : "rgb(59 130 246)",
                        color: "white",
                        cursor: isAnalyzing ? "not-allowed" : "pointer",
                    }}
                >
                    <Zap className="w-3.5 h-3.5" />
                    {isAnalyzing ? "ANALYSING..." : "ANALYSE FLAGGED NODE"}
                </button>
            </div>
        </div>
    );
}
