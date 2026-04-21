"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileCard() {
    const [name, setName] = useState("Compliance Officer");
    const [role, setRole] = useState("AML Analyst");
    const [institution, setInstitution] = useState(
        "Nigerian Commercial Bank Plc",
    );

    return (
        <Card
            style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
            }}
        >
            <CardHeader>
                <CardTitle className="text-sm">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="officer-name">Officer name</Label>
                    <Input
                        id="officer-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="officer-role">Role</Label>
                    <Input
                        id="officer-role"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="officer-institution">Institution</Label>
                    <Input
                        id="officer-institution"
                        value={institution}
                        onChange={(event) => setInstitution(event.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
