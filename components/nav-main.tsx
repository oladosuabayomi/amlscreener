"use client";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function NavMain({
    items,
    flaggedCount,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
    }[];
    flaggedCount?: number;
}) {
    return (
        <SidebarGroup style={{ padding: "10px 8px" }}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.isActive}
                                tooltip={item.title}
                            >
                                <Link
                                    href={item.url}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    {item.icon && (
                                        <item.icon
                                            size={14}
                                            className="shrink-0"
                                        />
                                    )}
                                    <span
                                        style={{
                                            fontSize: 11,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                            {/* Show badge on Flagged nav item */}
                            {item.title === "Flagged" && flaggedCount && (
                                <SidebarMenuBadge
                                    style={{
                                        fontSize: 9,
                                        fontFamily:
                                            "var(--font-mono, monospace)",
                                        color: "#f97316",
                                    }}
                                >
                                    {flaggedCount}
                                </SidebarMenuBadge>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
