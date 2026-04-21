"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
    "/": {
        title: "Transaction Intelligence",
        subtitle: "Live monitoring",
    },
    "/dashboard": {
        title: "Transaction Intelligence",
        subtitle: "Live monitoring",
    },
    "/transactions": {
        title: "Full Transaction Log",
        subtitle: "Search, filter, and export transaction history",
    },
    "/flagged": {
        title: "Flagged Alerts",
        subtitle: "Compliance action queue",
    },
    "/reports": {
        title: "SAR Reports",
        subtitle: "Regulatory submissions and compliance metrics",
    },
    "/settings": {
        title: "System Settings",
        subtitle: "Configuration and rule controls",
    },
};

export function SiteHeader() {
    const pathname = usePathname();

    const meta = ROUTE_META[pathname] ?? {
        title: "AML Screener",
        subtitle: "Compliance workspace",
    };

    return (
        <header
            className="flex h-12 shrink-0 items-center gap-2"
            style={{
                borderBottom: "1px solid var(--border)",
                background: "var(--surface-2)",
            }}
        >
            <div className="flex w-full items-center gap-3 px-5">
                <SidebarTrigger
                    className="-ml-1"
                    style={{ color: "var(--text-3)" }}
                />
                <Separator
                    orientation="vertical"
                    className="h-4"
                    style={{ background: "var(--border)" }}
                />
                <div className="flex items-center justify-between flex-1">
                    <div className="flex flex-col leading-none">
                        <h1
                            className="font-mono font-semibold"
                            style={{
                                fontSize: 13,
                                color: "var(--text-1)",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {meta.title}
                        </h1>
                        <p
                            className="font-mono"
                            style={{
                                fontSize: 10,
                                color: "var(--text-3)",
                                marginTop: 2,
                                letterSpacing: "0.02em",
                            }}
                        >
                            {meta.subtitle} ·{" "}
                            {new Date().toLocaleDateString("en-NG", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div
                        className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded"
                        style={{
                            border: "1px solid var(--border)",
                            color: "var(--text-2)",
                            background: "var(--surface)",
                        }}
                    >
                        CBN / NFIU Compliant
                    </div>
                </div>
            </div>
        </header>
    );
}
