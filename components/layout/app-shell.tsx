"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAccessRoute = pathname === "/";

    if (isAccessRoute) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <SidebarProvider
            defaultOpen={true}
            style={
                {
                    "--sidebar-width": "15rem",
                    "--sidebar-width-icon": "3rem",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset style={{ background: "var(--bg)" }}>
                <SiteHeader />
                <main className="flex-1 overflow-auto">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}