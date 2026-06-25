import React from "react";
import TransactionsClient, { Transaction, Anomaly } from "@/components/TransactionsClient";

export const revalidate = 0; // Disable static caching

export default async function AdminTransactionsPage() {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
    const apiKey = process.env.ADMIN_API_KEY || "";

    let transactionData = null;
    let errorMsg = null;

    try {
        const res = await fetch(`${backendUrl}/admin/transactions`, {
            headers: {
                "x-admin-key": apiKey,
            },
            next: { revalidate: 0 },
        });

        if (res.ok) {
            const json = await res.json();
            if (json.success) {
                transactionData = json.data;
            } else {
                errorMsg = json.message || "Failed to load transactions.";
            }
        } else {
            errorMsg = `Server returned status ${res.status}`;
        }
    } catch (error: any) {
        errorMsg = error.message || "Failed to connect to backend database.";
    }

    // Fallback to mock data if backend is offline/error
    if (!transactionData) {
        return (
            <div className="space-y-8">
                {/* Error / Offline Alert banner */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
                    <div className="space-y-1">
                        <span className="font-bold flex items-center gap-1.5">
                            ⚠️ Backend Database Offline (Running in Demo Mode)
                        </span>
                        <p className="text-xs text-amber-400/85 leading-relaxed">
                            The transactions panel could not connect to the backend database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
                        </p>
                    </div>
                </div>

                {/* Render Transactions with Mock Data */}
                <TransactionsClient initialData={getMockTransactionsData()} />
            </div>
        );
    }

    return <TransactionsClient initialData={transactionData} />;
}

// Resilient Mock Data Fallback with Security Anomalies included
function getMockTransactionsData(): {
    transactions: Transaction[];
    anomalies: Anomaly[];
    metrics: {
        totalCredits: number;
        totalDebits: number;
        totalRecharges: number;
        anomalyCount: number;
    };
} {
    return {
        transactions: [
            {
                id: "tx-recharge-1",
                wallet_id: "w-1",
                type: "credit",
                amount: "1000.00",
                status: "success",
                source: "recharge",
                description: "Razorpay wallet load",
                created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5m ago
                user_id: "u-1",
                phone: "+919876543210",
                user_name: "Amit Sharma",
                user_avatar: null,
                is_host: false,
                is_host_verified: false
            },
            {
                id: "tx-call-1",
                wallet_id: "w-1",
                type: "debit",
                amount: "120.00",
                status: "success",
                source: "call",
                description: "Audio call billing",
                created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15m ago
                user_id: "u-1",
                phone: "+919876543210",
                user_name: "Amit Sharma",
                user_avatar: null,
                is_host: false,
                is_host_verified: false
            },
            {
                id: "tx-withdrawal-1",
                wallet_id: "w-2",
                type: "debit",
                amount: "5000.00",
                status: "success",
                source: "withdrawal",
                description: "Bank transfer payout",
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
                user_id: "u-2",
                phone: "+918888877777",
                user_name: "Sarah Lawrence",
                user_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                is_host: true,
                is_host_verified: true
            },
            {
                id: "tx-anomaly-1", // Simulated Critical Security Bug/Anomaly!
                wallet_id: "w-2",
                type: "debit",
                amount: "350.00",
                status: "success",
                source: "call", // Anomalous: Host debited for outgoing call charges!
                description: "Outbound call debit (BUG DETECTED)",
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
                user_id: "u-2",
                phone: "+918888877777",
                user_name: "Sarah Lawrence",
                user_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                is_host: true,
                is_host_verified: true
            },
            {
                id: "tx-reward-1",
                wallet_id: "w-3",
                type: "credit",
                amount: "50.00",
                status: "success",
                source: "reward",
                description: "New registration bonus",
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12h ago
                user_id: "u-3",
                phone: "+14155558932",
                user_name: "John Doe",
                user_avatar: null,
                is_host: false,
                is_host_verified: false
            }
        ],
        anomalies: [
            {
                id: "tx-anomaly-1",
                user_id: "u-2",
                user_name: "Sarah Lawrence",
                phone: "+918888877777",
                amount: "350.00",
                source: "call",
                description: "Outbound call debit (BUG DETECTED)",
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
            }
        ],
        metrics: {
            totalCredits: 1050.00,
            totalDebits: 5470.00,
            totalRecharges: 1000.00,
            anomalyCount: 1
        }
    };
}