import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOGIN_COOKIE_NAME, LOGIN_COOKIE_VALUE } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.get(LOGIN_COOKIE_NAME)?.value === LOGIN_COOKIE_VALUE;

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
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
  );
}
