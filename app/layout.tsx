import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AML Screener — Compliance Dashboard",
  description:
    "AI-Powered Anti-Money Laundering Detection for Nigerian Financial Institutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${mono.variable} ${sans.variable} antialiased`}
        style={{ background: "var(--bg)" }}
      >
        <TooltipProvider>
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
        </TooltipProvider>
      </body>
    </html>
  );
}