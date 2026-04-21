"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerProfileModalProps {
    transaction: Transaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CustomerProfileModal({
    transaction,
    open,
    onOpenChange,
}: CustomerProfileModalProps) {
    if (!transaction) return null;

    // Mock customer data - in real app would fetch from API
    const customerData = {
        customerId: `CUST-${transaction.id.split('-')[1].padStart(4, '0')}`,
        name: "Adebayo Johnson",
        accountType: "Business Account",
        accountNumber: `****${transaction.id.split('-')[1]}89`,
        riskRating: transaction.riskLevel,
        customerSince: "2022-03-15",
        lastActivity: "2026-04-20",
        totalTransactions: 156,
        averageAmount: "₦2,450,000",
        flaggedTransactions: 3,
        kycStatus: "Verified",
        address: "123 Victoria Island, Lagos, Nigeria",
        phone: "+234 801 234 5678",
        email: "adebayo.johnson@business.ng",
    };

    const recentTransactions = [
        { id: "TXN-060", amount: 45000, date: "2026-04-20", status: "Flagged" },
        { id: "TXN-059", amount: 125000, date: "2026-04-19", status: "Cleared" },
        { id: "TXN-058", amount: 78000, date: "2026-04-18", status: "Normal" },
        { id: "TXN-057", amount: 256000, date: "2026-04-17", status: "Normal" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-mono text-sm tracking-wider">
                        CUSTOMER RISK PROFILE
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Customer Header */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{customerData.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {customerData.customerId} • {customerData.accountType}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        customerData.riskRating === "CRITICAL" ? "destructive" :
                                        customerData.riskRating === "HIGH" ? "secondary" :
                                        "outline"
                                    }
                                >
                                    {customerData.riskRating} RISK
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-semibold">Account Number</p>
                                <p className="text-muted-foreground">{customerData.accountNumber}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Customer Since</p>
                                <p className="text-muted-foreground">{customerData.customerSince}</p>
                            </div>
                            <div>
                                <p className="font-semibold">KYC Status</p>
                                <p className="text-muted-foreground">{customerData.kycStatus}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Last Activity</p>
                                <p className="text-muted-foreground">{customerData.lastActivity}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <p className="font-semibold">Address</p>
                                <p className="text-muted-foreground">{customerData.address}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Phone</p>
                                <p className="text-muted-foreground">{customerData.phone}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Email</p>
                                <p className="text-muted-foreground">{customerData.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Transaction Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold">Total Transactions</p>
                                    <p className="text-2xl font-bold">{customerData.totalTransactions}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Average Amount</p>
                                    <p className="text-2xl font-bold">{customerData.averageAmount}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Flagged Transactions</p>
                                    <p className="text-2xl font-bold text-red-600">{customerData.flaggedTransactions}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Flagged Rate</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {((customerData.flaggedTransactions / customerData.totalTransactions) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recentTransactions.map((txn) => (
                                    <div key={txn.id} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <p className="font-mono text-sm">{txn.id}</p>
                                            <p className="text-xs text-muted-foreground">{txn.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">₦{txn.amount.toLocaleString()}</p>
                                            <Badge
                                                variant={txn.status === "Flagged" ? "destructive" : "outline"}
                                                className="text-xs"
                                            >
                                                {txn.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}