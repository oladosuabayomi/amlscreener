"use client";

import * as React from "react";
import Link from "next/link";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string;
        url: string;
        icon: React.ReactNode;
        isActive?: boolean;
    }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.url.startsWith("/") ? (
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.isActive}
                                >
                                    <Link
                                        href={item.url}
                                        style={{
                                            fontSize: 11,
                                            letterSpacing: "0.03em",
                                        }}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton asChild>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            fontSize: 11,
                                            letterSpacing: "0.03em",
                                        }}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
