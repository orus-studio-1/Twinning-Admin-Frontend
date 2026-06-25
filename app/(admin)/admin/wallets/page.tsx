import React from "react";
import WalletsClient, { WalletTransaction, WalletAnomaly } from "@/components/WalletsClient";

export const revalidate = 0; // Disable static caching

export default async function AdminWalletsPage() {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
    const apiKey = process.env.ADMIN_API_KEY || "";

    let walletData = null;
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
                const allTransactions = json.data.transactions;
                
                // Filter only internal wallet transactions
                const internalTx = allTransactions.filter(
                    (tx: any) => tx.source === "call" || tx.source === "live" || tx.source === "reward"
                );
                
                // Recalculate metrics
                let totalCredits = 0; // Host earnings & rewards
                let totalDebits = 0;  // Caller deductions
                const anomalies: WalletAnomaly[] = [];

                internalTx.forEach((tx: any) => {
                    const amt = parseFloat(tx.amount);
                    if (tx.status === "success") {
                        if (tx.type === "credit") {
                            totalCredits += amt;
                        } else if (tx.type === "debit") {
                            totalDebits += amt;
                        }
                    }

                    // Detect Anomalies (Hosts debited for outgoing calls/live)
                    if (tx.type === "debit" && ["call", "live"].includes(tx.source) && tx.is_host) {
                        anomalies.push({
                            id: tx.id,
                            user_id: tx.user_id,
                            user_name: tx.user_name || "Unknown Host",
                            phone: tx.phone,
                            amount: tx.amount,
                            source: tx.source,
                            description: tx.description,
                            created_at: tx.created_at,
                            user_avatar: tx.user_avatar
                        });
                    }
                });

                walletData = {
                    transactions: internalTx,
                    anomalies,
                    metrics: {
                        totalCredits,
                        totalDebits,
                        anomalyCount: anomalies.length
                    }
                };
            } else {
                errorMsg = json.message || "Failed to load wallet transactions.";
            }
        } else {
            errorMsg = `Server returned status ${res.status}`;
        }
    } catch (error: any) {
        errorMsg = error.message || "Failed to connect to backend database.";
    }

    // Fallback to mock data if backend is offline/error
    if (!walletData) {
        return (
            <div className="space-y-8">
                {/* Error / Offline Alert banner */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
                    <div className="space-y-1">
                        <span className="font-bold flex items-center gap-1.5">
                            ⚠️ Backend Database Offline (Running in Demo Mode)
                        </span>
                        <p className="text-xs text-amber-400/85 leading-relaxed">
                            The wallet auditing panel could not connect to the database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
                        </p>
                    </div>
                </div>

                {/* Render Wallets Client with Mock Data */}
                <WalletsClient initialData={getMockWalletData()} />
            </div>
        );
    }

    return <WalletsClient initialData={walletData} />;
}

// High-fidelity internal wallet mock data
function getMockWalletData(): {
    transactions: WalletTransaction[];
    anomalies: WalletAnomaly[];
    metrics: {
        totalCredits: number;
        totalDebits: number;
        anomalyCount: number;
    };
} {
    return {
        transactions: [
            {
                id: "tx-call-1",
                wallet_id: "w-1",
                type: "debit",
                amount: "120.00",
                status: "success",
                source: "call",
                description: "Deducted from Amit Sharma (Client) for 7 mins Audio Call to Sarah Lawrence",
                created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15m ago
                user_id: "u-1",
                phone: "+919876543210",
                user_name: "Amit Sharma",
                user_avatar: null,
                is_host: false,
                is_host_verified: false
            },
            {
                id: "tx-call-earn-1",
                wallet_id: "w-2",
                type: "credit",
                amount: "78.00",
                status: "success",
                source: "call",
                description: "Credited to Sarah Lawrence (Host) for 7 mins Audio Call from Amit Sharma (70% split)",
                created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15m ago
                user_id: "u-2",
                phone: "+918888877777",
                user_name: "Sarah Lawrence",
                user_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                is_host: true,
                is_host_verified: true
            },
            {
                id: "tx-anomaly-1", // Host debited bug
                wallet_id: "w-2",
                type: "debit",
                amount: "350.00",
                status: "success",
                source: "call",
                description: "Outbound call debit (BUG DETECTED: Host charged for outgoing call)",
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
                description: "Credited to John Doe: New registration bonus",
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
                description: "Outbound call debit (BUG DETECTED: Host charged for outgoing call)",
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
                user_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
            }
        ],
        metrics: {
            totalCredits: 128.00,
            totalDebits: 470.00,
            anomalyCount: 1
        }
    };
}