"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActionFeed } from "@/components/dashboard/action-feed";
import { Wallet, TrendingUp, Zap, PiggyBank } from "lucide-react";
import { formatUSD, formatPercent } from "@/lib/utils";

interface AgentAction { id: number; actionType: string; reason: string; amount: number | null; status: string; route: string | null; confidence: number | null; createdAt: string; }
interface DashboardData { recentActions: AgentAction[]; todayPnl: number; todayActionCount: number; x402Earnings: number; x402Calls: number; }

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    async function fetchData() { try { const res = await fetch("/api/dashboard"); if (res.ok) setData(await res.json()); } catch (e) { console.error("Failed to fetch dashboard:", e); } }
    fetchData(); const interval = setInterval(fetchData, 30000); return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-sm text-muted-foreground">Autonomous agent performance on X Layer</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value={formatUSD(1000)} icon={Wallet} />
        <StatCard title="Today P&L" value={formatUSD(data?.todayPnl ?? 0)} change={formatPercent(((data?.todayPnl ?? 0) / 1000) * 100)} changeType={(data?.todayPnl ?? 0) >= 0 ? "positive" : "negative"} icon={TrendingUp} />
        <StatCard title="x402 Revenue" value={formatUSD(data?.x402Earnings ?? 0)} subtitle={`${data?.x402Calls ?? 0} API calls`} icon={Zap} />
        <StatCard title="DeFi Yield" value={formatUSD(0)} subtitle="APY --" icon={PiggyBank} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionFeed actions={data?.recentActions ?? []} />
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-base font-semibold mb-4">Portfolio Value (7D)</h3>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm">Chart loads with real data</div>
        </div>
      </div>
    </div>
  );
}
