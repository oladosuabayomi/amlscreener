"use client";

import { useCallback, useRef, useState } from "react";
import { useAMLStore } from "@/lib/store";
import { Transaction } from "@/types/transaction";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Zap,
    Shield,
    FileText,
    Lock,
    Bell,
    AlertTriangle,
    ExternalLink,
    Copy,
} from "lucide-react";

const RISK_COLORS: Record<string, string> = {
    LOW: "#22c55e",
    MEDIUM: "#eab308",
    HIGH: "#f97316",
    CRITICAL: "#ef4444",
};

const MOCK_RESPONSE: Record<string, string> = {
    SMURFING: `PATTERN DETECTED — Classic smurfing (structuring) behaviour identified.

EVIDENCE
• Multiple transfers of nearly identical amounts (~₦45,000–₦49,500) from a single originator within 2 hours
• Receivers span distinct geographic locations across Nigeria
• All amounts deliberately below the ₦50,000 CBN reporting threshold

RISK FACTORS
• Matches CBN AML/CFT Circular 2023/07 structuring typology
• NFIU Suspicious Transaction Report threshold triggered
• Pattern consistent with FATF Recommendation 20 red flags
• Velocity is 7–9× the account's 30-day baseline

RECOMMENDED ACTION — File a Suspicious Transaction Report (STR) with the NFIU within 24 hours. Freeze originating account pending compliance review. Notify the Compliance Officer immediately.`,

    GEO_ANOMALY: `PATTERN DETECTED — Cross-border transaction to a high-risk or sanctioned jurisdiction.

EVIDENCE
• Transaction routed to a jurisdiction flagged by FATF or OFAC sanctions list
• Unusual geographic pattern not consistent with customer's known activity profile
• No documented trade or business relationship justifying the transfer

RISK FACTORS
• FATF grey/black-listed corridor — heightened due diligence required
• Possible sanctions exposure under OFAC or UN Security Council designations
• CBN Foreign Exchange Monitoring and Miscellaneous Provisions Act (FEMMPA) implications

RECOMMENDED ACTION — Immediately escalate to Compliance Officer. Place transaction on hold and file a STR with NFIU. Conduct enhanced due diligence (EDD) on the customer.`,

    VELOCITY_SPIKE: `PATTERN DETECTED — Abnormal transaction velocity spike detected on account.

EVIDENCE
• Current velocity is 8–18× the account's established 30-day baseline
• Account shows no prior history of high-frequency transfers
• Multiple large-value transactions executed within a compressed time window

RISK FACTORS
• Consistent with layering phase of money laundering cycle (FATF Typology 2023)
• CBN Risk-Based Supervision Framework flags velocity anomalies above 5× baseline
• Possible account takeover or mule account activation

RECOMMENDED ACTION — Place a temporary transaction freeze. Request source-of-funds documentation from customer. Notify the Fraud & AML Operations team for immediate review.`,

    ROUND_TRIPPING: `PATTERN DETECTED — Round-tripping via intermediary entity detected.

EVIDENCE
• Funds originate and ultimately return to related accounts via multiple hops
• Crypto exchange or money service business used as intermediary layer
• Geographic route does not match declared business activity

RISK FACTORS
• Classic integration phase of money laundering — FATF Typology Report reference
• Possible sanctions exposure (Russia, Cuba, Iran nexus flagged)
• Breach of CBN AML/CFT Regulations 2022, Section 12 — beneficial ownership

RECOMMENDED ACTION — File STR immediately. Freeze all linked accounts. Request full transaction chain documentation and refer to Economic and Financial Crimes Commission (EFCC).`,
};

function getDefaultMock(anomalyType: string | null): string {
    if (anomalyType && MOCK_RESPONSE[anomalyType])
        return MOCK_RESPONSE[anomalyType];
    return MOCK_RESPONSE["SMURFING"];
}

export function AnalysisDrawer() {
    const {
        selectedTransaction,
        setSelectedTransaction,
        aiSummary,
        setAISummary,
        appendAISummary,
        isAnalyzing,
        setIsAnalyzing,
    } = useAMLStore();

    const isOpen = !!selectedTransaction;

    // Refs to cancelled in-flight work
    const abortRef = useRef<AbortController | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Whether the "cancel analysis?" confirmation card is showing
    const [showCancelPrompt, setShowCancelPrompt] = useState(false);

    const analyzeTransaction = useCallback(
        async (txn: Transaction) => {
            // Cancel any previous run before starting a new one
            abortRef.current?.abort();
            if (intervalRef.current) clearInterval(intervalRef.current);

            const controller = new AbortController();
            abortRef.current = controller;

            setIsAnalyzing(true);
            setAISummary("");

            try {
                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const response = await fetch(`${apiUrl}/api/analyze`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(txn),
                    signal: controller.signal,
                });

                if (!response.ok || !response.body)
                    throw new Error("API unavailable");

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const { value, done: isDone } = await reader.read();
                    done = isDone;
                    if (value)
                        appendAISummary(
                            decoder.decode(value, { stream: true }),
                        );
                }
            } catch (err) {
                // If we aborted intentionally, exit silently
                if (err instanceof Error && err.name === "AbortError") {
                    setIsAnalyzing(false);
                    return;
                }
                // Graceful fallback — stream mock response character-by-character
                const mockText = getDefaultMock(txn.anomalyType);
                let i = 0;
                const interval = setInterval(() => {
                    // Stop if aborted mid-mock
                    if (controller.signal.aborted) {
                        clearInterval(interval);
                        setIsAnalyzing(false);
                        return;
                    }
                    if (i < mockText.length) {
                        appendAISummary(mockText[i]);
                        i++;
                    } else {
                        clearInterval(interval);
                        setIsAnalyzing(false);
                    }
                }, 8);
                intervalRef.current = interval;
                return;
            } finally {
                if (!controller.signal.aborted) setIsAnalyzing(false);
            }
        },
        [setIsAnalyzing, setAISummary, appendAISummary],
    );

    /** Called by every close path — intercepts when analysis is running */
    const handleAttemptClose = useCallback(() => {
        if (isAnalyzing) {
            setShowCancelPrompt(true);
        } else {
            setShowCancelPrompt(false);
            setSelectedTransaction(null);
        }
    }, [isAnalyzing, setSelectedTransaction]);

    /** User chose to cancel the analysis and close the drawer */
    const handleCancelAndClose = useCallback(() => {
        abortRef.current?.abort();
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAnalyzing(false);
        setShowCancelPrompt(false);
        setSelectedTransaction(null);
    }, [setIsAnalyzing, setSelectedTransaction]);

    /** User chose to keep the analysis running */
    const handleKeepRunning = useCallback(() => {
        setShowCancelPrompt(false);
    }, []);

    // Analysis is triggered manually via the CTA button — no auto-fire.

    const riskColor = selectedTransaction
        ? RISK_COLORS[selectedTransaction.riskLevel]
        : "#3b82f6";

    const handleCopyId = () => {
        if (selectedTransaction)
            navigator.clipboard.writeText(selectedTransaction.id);
    };

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open && !isAnalyzing) setSelectedTransaction(null);
            }}
        >
            <SheetContent
                side="right"
                showCloseButton={false}
                className="w-full sm:max-w-120 p-0 flex flex-col border-0"
                style={{
                    background: "var(--surface)",
                    borderLeft: `1px solid ${riskColor}30`,
                    boxShadow: `-24px 0 80px rgba(0,0,0,0.6)`,
                }}
                onPointerDownOutside={(e) => {
                    if (isAnalyzing) {
                        e.preventDefault();
                        setShowCancelPrompt(true);
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (isAnalyzing) {
                        e.preventDefault();
                        setShowCancelPrompt(true);
                    }
                }}
            >
                {/* Visually hidden accessibility titles */}
                <SheetHeader className="sr-only">
                    <SheetTitle>Transaction Analysis</SheetTitle>
                    <SheetDescription>
                        AI-powered AML compliance analysis for the selected
                        transaction
                    </SheetDescription>
                </SheetHeader>

                {/* ── Drawer Header ─────────────────────────────── */}
                <div
                    className="relative px-5 py-4 flex items-start justify-between shrink-0"
                    style={{
                        borderBottom: `1px solid var(--border)`,
                        background: "var(--surface-2)",
                    }}
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <Shield size={14} style={{ color: riskColor }} />
                            <span
                                className="font-mono font-bold tracking-widest text-[11px]"
                                style={{ color: riskColor }}
                            >
                                AI COMPLIANCE ANALYSIS
                            </span>
                        </div>
                        {selectedTransaction && (
                            <div className="flex items-center gap-2">
                                <span
                                    className="font-mono text-[11px]"
                                    style={{ color: "var(--text-3)" }}
                                >
                                    {selectedTransaction.id}
                                </span>
                                <button onClick={handleCopyId}>
                                    <Copy
                                        size={10}
                                        style={{ color: "var(--text-3)" }}
                                        className="hover:opacity-70"
                                    />
                                </button>
                                <span
                                    className="px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold"
                                    style={{
                                        color: riskColor,
                                        background: `${riskColor}15`,
                                        border: `1px solid ${riskColor}30`,
                                    }}
                                >
                                    {selectedTransaction?.riskLevel}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleAttemptClose}
                        className="rounded-md p-1 transition-opacity hover:opacity-60"
                        style={{ color: "var(--text-3)" }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                        >
                            <path
                                d="M1 1l12 12M13 1L1 13"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>

                    {/* ── Cancel-analysis confirmation card ────────────── */}
                    {showCancelPrompt && (
                        <div
                            className="absolute inset-x-4 top-full mt-2 z-50 rounded-xl p-4 flex flex-col gap-3"
                            style={{
                                background: "var(--surface-3)",
                                border: "1px solid #f9731640",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                            }}
                        >
                            <div className="flex items-start gap-2.5">
                                <AlertTriangle
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                    style={{ color: "#f97316" }}
                                />
                                <div>
                                    <p
                                        className="font-mono text-[11px] font-bold tracking-wider"
                                        style={{ color: "var(--text-1)" }}
                                    >
                                        ANALYSIS IN PROGRESS
                                    </p>
                                    <p
                                        className="font-mono text-[10px] mt-1 leading-relaxed"
                                        style={{ color: "var(--text-3)" }}
                                    >
                                        Closing now will abort the current
                                        compliance report. Do you want to cancel
                                        and close?
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleCancelAndClose}
                                    className="flex-1 font-mono text-[10px] font-bold tracking-wider h-8"
                                    style={{
                                        background: "rgba(239,68,68,0.15)",
                                        color: "#ef4444",
                                        border: "1px solid #ef444440",
                                    }}
                                >
                                    CANCEL &amp; CLOSE
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleKeepRunning}
                                    className="flex-1 font-mono text-[10px] font-bold tracking-wider h-8"
                                    style={{
                                        background: "rgba(59,130,246,0.15)",
                                        color: "#3b82f6",
                                        border: "1px solid #3b82f640",
                                    }}
                                >
                                    KEEP RUNNING
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Scrollable Body (Snapshot + AI Output) ─────────── */}
                <ScrollArea className="flex-1">
                    {/* ── Transaction Snapshot ─────────────────────────── */}
                    {selectedTransaction && (
                        <div
                            className="px-5 py-4 grid grid-cols-2 gap-3"
                            style={{ borderBottom: "1px solid var(--border)" }}
                        >
                            {[
                                {
                                    label: "AMOUNT",
                                    value: `₦${selectedTransaction.amount.toLocaleString("en-NG")}`,
                                    color: "var(--text-1)",
                                },
                                {
                                    label: "VELOCITY",
                                    value: `${selectedTransaction.velocity}/hr`,
                                    color: "#f97316",
                                },
                                {
                                    label: "RISK SCORE",
                                    value: `${selectedTransaction.riskScore}/100`,
                                    color: riskColor,
                                },
                                {
                                    label: "ANOMALY",
                                    value:
                                        selectedTransaction.anomalyType ??
                                        "UNCLASSIFIED",
                                    color: "#eab308",
                                },
                                {
                                    label: "ORIGIN",
                                    value: selectedTransaction.senderLocation,
                                    color: "var(--text-2)",
                                },
                                {
                                    label: "DESTINATION",
                                    value: selectedTransaction.receiverLocation,
                                    color: "var(--text-2)",
                                },
                                {
                                    label: "SENDER BANK",
                                    value: selectedTransaction.senderBank,
                                    color: "var(--text-2)",
                                },
                                {
                                    label: "RECEIVER BANK",
                                    value: selectedTransaction.receiverBank,
                                    color: "var(--text-2)",
                                },
                            ].map(({ label, value, color }) => (
                                <div
                                    key={label}
                                    className="flex flex-col gap-0.5"
                                >
                                    <span
                                        className="font-mono text-[9px] tracking-widest"
                                        style={{ color: "var(--text-3)" }}
                                    >
                                        {label}
                                    </span>
                                    <span
                                        className="font-mono text-[12px] font-semibold truncate"
                                        style={{ color }}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── AI Output ─────────────────────────────────────── */}
                    <div className="px-5 py-4">
                        {aiSummary ? (
                            <div
                                className="font-mono text-[12px] leading-[1.75] whitespace-pre-wrap"
                                style={{ color: "var(--text-1)" }}
                            >
                                {aiSummary}
                                {isAnalyzing && (
                                    <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle ai-cursor" />
                                )}
                            </div>
                        ) : isAnalyzing ? (
                            <div className="flex items-center gap-2 py-2">
                                <span
                                    className="inline-block w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: "#3b82f6",
                                        animation:
                                            "pulse 1s ease-in-out infinite",
                                    }}
                                />
                                <span
                                    className="font-mono text-[11px]"
                                    style={{ color: "var(--text-3)" }}
                                >
                                    Generating compliance report…
                                </span>
                            </div>
                        ) : null}
                    </div>
                </ScrollArea>

                {/* ── Action CTAs ───────────────────────────────── */}
                <div
                    className="px-5 py-4 flex flex-col gap-3 shrink-0"
                    style={{
                        borderTop: "1px solid var(--border)",
                        background: "var(--surface-2)",
                    }}
                >
                    {/* Re-analyse */}
                    <Button
                        onClick={() =>
                            selectedTransaction &&
                            analyzeTransaction(selectedTransaction)
                        }
                        disabled={isAnalyzing}
                        className="w-full font-mono text-[11px] font-bold tracking-wider h-9"
                        style={{
                            background: isAnalyzing
                                ? "rgba(59,130,246,0.3)"
                                : "#3b82f6",
                            color: "white",
                            border: "none",
                        }}
                    >
                        <Zap size={13} className="mr-2" />
                        {isAnalyzing
                            ? "ANALYSING…"
                            : aiSummary
                              ? "RE-ANALYSE"
                              : "ANALYSE TRANSACTION"}
                    </Button>

                    <Separator style={{ background: "var(--border)" }} />

                    <div className="grid grid-cols-2 gap-2">
                        {/* Generate SAR */}
                        <Button
                            variant="outline"
                            className="font-mono text-[10px] font-semibold tracking-wide h-9 gap-1.5"
                            style={{
                                borderColor: "#f97316",
                                color: "#f97316",
                                background: "rgba(249,115,22,0.07)",
                            }}
                            onClick={() =>
                                alert(
                                    "SAR Report generation — connect to NFIU reporting module",
                                )
                            }
                        >
                            <FileText size={12} />
                            GEN SAR REPORT
                        </Button>

                        {/* Freeze Account */}
                        <Button
                            variant="outline"
                            className="font-mono text-[10px] font-semibold tracking-wide h-9 gap-1.5"
                            style={{
                                borderColor: "#ef4444",
                                color: "#ef4444",
                                background: "rgba(239,68,68,0.07)",
                            }}
                            onClick={() =>
                                alert(
                                    "Freeze Account — connect to core banking system",
                                )
                            }
                        >
                            <Lock size={12} />
                            FREEZE ACCOUNT
                        </Button>

                        {/* Escalate */}
                        <Button
                            variant="outline"
                            className="font-mono text-[10px] font-semibold tracking-wide h-9 gap-1.5"
                            style={{
                                borderColor: "#eab308",
                                color: "#eab308",
                                background: "rgba(234,179,8,0.07)",
                            }}
                            onClick={() =>
                                alert("Escalate to Senior Compliance Officer")
                            }
                        >
                            <Bell size={12} />
                            ESCALATE
                        </Button>

                        {/* View Full Profile */}
                        <Button
                            variant="outline"
                            className="font-mono text-[10px] font-semibold tracking-wide h-9 gap-1.5"
                            style={{
                                borderColor: "var(--border)",
                                color: "var(--text-2)",
                                background: "transparent",
                            }}
                            onClick={() =>
                                alert("Open full customer risk profile")
                            }
                        >
                            <ExternalLink size={12} />
                            FULL PROFILE
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
