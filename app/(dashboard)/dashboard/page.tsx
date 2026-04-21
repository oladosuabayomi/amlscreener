import { AnalysisDrawer } from "@/components/dashboard/AnalysisDrawer";
import { RiskScatterPlot } from "@/components/dashboard/RiskScatterPlot";
import { StatCards } from "@/components/dashboard/StatCards";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardRoutePage() {
    return (
        <>
            <AnalysisDrawer />

            <div className="p-6 space-y-6">
                <section
                    className="border p-4"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--surface)",
                    }}
                >
                    <h2 className="text-lg font-semibold tracking-wider uppercase">
                        Transaction Intelligence
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Live AML monitoring, risk clustering, and analyst-ready
                        transaction review.
                    </p>
                </section>

                <StatCards />

                <RiskScatterPlot />

                <section className="space-y-3">
                    <Card
                        size="sm"
                        style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <CardHeader>
                            <CardTitle className="text-xs">
                                Analyst Queue
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            Click any flagged transaction row to open the
                            right-side AI analysis drawer.
                        </CardContent>
                    </Card>

                    <TransactionTable />
                </section>
            </div>
        </>
    );
}
