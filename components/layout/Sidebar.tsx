"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  ListFilter,
  AlertTriangle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { riskSummary } from "@/lib/data";

const navMain = [
  { icon: BarChart3,    label: "Dashboard",      href: "/",  active: true,  badge: null },
  { icon: ListFilter,   label: "Transactions",   href: "/",  active: false, badge: String(riskSummary.total) },
  { icon: AlertTriangle,label: "Flagged",        href: "/",  active: false, badge: String(riskSummary.flagged) },
  { icon: Settings,     label: "Settings",       href: "/",  active: false, badge: null },
];

function LiveDot() {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
      style={{ background: "#22c55e", animation: "pulse 2s ease-in-out infinite" }}
    />
  );
}

function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      style={
        {
          "--sidebar-background": "var(--surface)",
          "--sidebar-border": "var(--border)",
          "--sidebar-foreground": "var(--text-1)",
          "--sidebar-accent": "rgba(59,130,246,0.09)",
          "--sidebar-accent-foreground": "#3b82f6",
          "--sidebar-primary": "#3b82f6",
          "--sidebar-primary-foreground": "#fff",
          "--sidebar-ring": "#3b82f6",
          "--sidebar-muted-foreground": "var(--text-3)",
        } as React.CSSProperties
      }
    >
      {/* ── Logo ─────────────────────────────── */}
      <SidebarHeader style={{ borderBottom: "1px solid var(--border)", padding: "14px 16px" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="AML Screener" asChild>
              <div style={{ cursor: "default", display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Logo mark */}
                <div style={{
                  width: 28, height: 28, flexShrink: 0,
                  background: "#3b82f6", borderRadius: 7,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: "0.06em",
                  fontFamily: "var(--font-mono, monospace)",
                  position: "relative",
                }}>
                  AML
                  <span style={{
                    position: "absolute", top: -3, right: -3,
                    width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                    border: "1.5px solid var(--surface)",
                  }} />
                </div>
                {/* Name */}
                <div className="flex flex-col leading-none">
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "var(--text-1)", fontFamily: "var(--font-mono, monospace)" }}>
                    AML SCREENER
                  </span>
                  <span style={{ fontSize: 9, letterSpacing: "0.07em", color: "var(--text-3)", marginTop: 2, fontFamily: "var(--font-mono, monospace)" }}>
                    NFIU · CBN COMPLIANT
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ───────────────────────── */}
      <SidebarContent style={{ padding: "8px 6px" }}>
        <SidebarGroup>
          <SidebarGroupLabel style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--text-3)", paddingLeft: 10 }}>
            COMPLIANCE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map(({ icon: Icon, label, href, active, badge }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={label}
                    className="rounded-md transition-all"
                  >
                    <Link href={href} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Icon size={14} className="shrink-0" />
                      <span style={{ fontSize: 12, letterSpacing: "0.01em" }}>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {badge && (
                    <SidebarMenuBadge style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", color: "var(--text-3)" }}>
                      {badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ───────────────────────────── */}
      <SidebarFooter style={{ borderTop: "1px solid var(--border)", padding: "10px 12px" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Live monitoring active"
              style={{ cursor: "default", gap: 8 }}
            >
              <LiveDot />
              <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text-3)", fontFamily: "var(--font-mono, monospace)" }}>
                LIVE MONITORING
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar, SidebarProvider, SidebarTrigger, SidebarInset };
