"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    BarChart3Icon,
    ListFilterIcon,
    AlertTriangleIcon,
    ShieldCheckIcon,
    Settings2Icon,
    CircleHelpIcon,
    FileTextIcon,
} from "lucide-react";
import { riskSummary } from "@/lib/data";
import { usePathname } from "next/navigation";

const data = {
    user: {
        name: "Compliance Officer",
        email: "compliance@amlscreener.ng",
        avatar: "",
    },
    navMain: [
        { title: "Dashboard", url: "/dashboard", icon: BarChart3Icon },
        { title: "Transactions", url: "/transactions", icon: ListFilterIcon },
        { title: "Flagged", url: "/flagged", icon: AlertTriangleIcon },
        { title: "Reports", url: "/reports", icon: FileTextIcon },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: <Settings2Icon size={14} />,
        },
        {
            title: "Help",
            url: "https://learning.postman.com/",
            icon: <CircleHelpIcon size={14} />,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    const navMain = data.navMain.map((item) => ({
        ...item,
        isActive: pathname === item.url || pathname.startsWith(`${item.url}/`),
    }));

    const navSecondary = data.navSecondary.map((item) => ({
        ...item,
        isActive:
            item.url.startsWith("/") &&
            (pathname === item.url || pathname.startsWith(`${item.url}/`)),
    }));

    return (
        <Sidebar
            collapsible="icon"
            {...props}
            style={
                {
                    "--sidebar-background": "var(--surface)",
                    "--sidebar-border": "var(--border)",
                    "--sidebar-foreground": "var(--text-1)",
                    "--sidebar-accent": "rgba(59,130,246,0.09)",
                    "--sidebar-accent-foreground": "#3b82f6",
                    "--sidebar-primary": "#3b82f6",
                    "--sidebar-primary-foreground": "#fff",
                } as React.CSSProperties
            }
        >
            {/* Logo */}
            <SidebarHeader
                style={{
                    borderBottom: "1px solid var(--border)",
                    padding: "14px 16px",
                    background: "var(--surface-2)",
                }}
            >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            tooltip="AML Screener"
                            asChild
                        >
                            <div
                                style={{
                                    cursor: "default",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                {/* Logo mark */}
                                <div
                                    style={{
                                        width: 30,
                                        height: 30,
                                        flexShrink: 0,
                                        background: "#3b82f6",
                                        borderRadius: 7,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 8,
                                        fontWeight: 700,
                                        color: "#fff",
                                        letterSpacing: "0.06em",
                                        fontFamily:
                                            "var(--font-mono, monospace)",
                                        position: "relative",
                                    }}
                                >
                                    <ShieldCheckIcon size={14} color="#fff" />
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: -3,
                                            right: -3,
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            background: "#22c55e",
                                            border: "2px solid var(--surface)",
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            letterSpacing: "0.1em",
                                            color: "var(--text-1)",
                                            fontFamily:
                                                "var(--font-mono, monospace)",
                                        }}
                                    >
                                        AML SCREENER
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 9,
                                            letterSpacing: "0.07em",
                                            color: "var(--text-3)",
                                            marginTop: 2,
                                            fontFamily:
                                                "var(--font-mono, monospace)",
                                        }}
                                    >
                                        NFIU · CBN COMPLIANT
                                    </span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <NavMain items={navMain} flaggedCount={riskSummary.flagged} />
                <NavSecondary items={navSecondary} className="mt-auto" />
            </SidebarContent>

            {/* User */}
            <SidebarFooter
                style={{
                    borderTop: "1px solid var(--border)",
                    background: "var(--surface-2)",
                }}
            >
                {/* Live monitoring badge */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Live monitoring active"
                            style={{ cursor: "default" }}
                        >
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                    background: "#22c55e",
                                    animation: "pulse 2s ease-in-out infinite",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 9,
                                    letterSpacing: "0.12em",
                                    color: "var(--text-3)",
                                    fontFamily: "var(--font-mono, monospace)",
                                }}
                            >
                                LIVE MONITORING
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
