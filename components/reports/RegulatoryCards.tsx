import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const REFERENCES = [
    {
        title: "FATF Recommendation 20",
        description:
            "Suspicious transaction reporting obligations for financial institutions.",
        url: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html",
    },
    {
        title: "CBN AML/CFT Circular 2023/07",
        description:
            "Nigeria compliance controls for transaction monitoring and escalation.",
        url: "https://www.cbn.gov.ng",
    },
    {
        title: "NFIU STR Template",
        description:
            "Template and filing workflow for suspicious transaction reports.",
        url: "https://www.nfiu.gov.ng",
    },
];

export function RegulatoryCards() {
    return (
        <div className="space-y-4">
            {REFERENCES.map((reference) => (
                <Card
                    key={reference.title}
                    size="sm"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <CardHeader>
                        <CardTitle className="text-xs">
                            {reference.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                            {reference.description}
                        </p>
                        <Button size="xs" variant="outline" asChild>
                            <a
                                href={reference.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open reference
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
