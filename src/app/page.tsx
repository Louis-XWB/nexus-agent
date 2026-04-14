"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActionFeed } from "@/components/dashboard/action-feed";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Zap, PiggyBank, ArrowUpRight } from "lucide-react";
import { formatUSD, formatPercent } from "@/lib/utils";

interface AgentAction { id: number; actionType: string; reason: string; amount: number | null; status: string; route: string | null; confidence: number | null; createdAt: string; }
interface DashboardData { recentActions: AgentAction[]; todayPnl: number; todayActionCount: number; x402Earnings: number; x402Calls: number; }

// 7-day simulated portfolio data
const portfolioHistory = [
  { day: "Mon", value: 980, pnl: -20 },
  { day: "Tue", value: 995, pnl: 15 },
  { day: "Wed", value: 1008, pnl: 13 },
  { day: "Thu", value: 1003, pnl: -5 },
  { day: "Fri", value: 1025, pnl: 22 },
  { day: "Sat", value: 1018, pnl: -7 },
  { day: "Today", value: 1038, pnl: 20 },
];

const assetAllocation = [
  { name: "USDC", pct: 45, color: "bg-blue-500", value: 467 },
  { name: "WETH", pct: 25, color: "bg-purple-500", value: 259 },
  { name: "OKB", pct: 15, color: "bg-amber-500", value: 156 },
  { name: "Aave (DeFi)", pct: 15, color: "bg-emerald-500", value: 156 },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    async function fetchData() { try { const res = await fetch("/api/dashboard"); if (res.ok) setData(await res.json()); } catch (e) { console.error("Failed to fetch dashboard:", e); } }
    fetchData(); const interval = setInterval(fetchData, 30000); return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...portfolioHistory.map(d => d.value));
  const minValue = Math.min(...portfolioHistory.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-sm text-muted-foreground">Autonomous agent performance on X Layer</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value={formatUSD(1038)} change="+3.8% (7D)" changeType="positive" icon={Wallet} />
        <StatCard title="Today P&L" value={formatUSD(data?.todayPnl ?? 0)} change={formatPercent(((data?.todayPnl ?? 0) / 1000) * 100)} changeType={(data?.todayPnl ?? 0) >= 0 ? "positive" : "negative"} icon={TrendingUp} />
        <StatCard title="x402 Revenue" value={formatUSD(data?.x402Earnings ?? 0)} subtitle={`${data?.x402Calls ?? 0} API calls`} icon={Zap} />
        <StatCard title="DeFi Yield" value={formatUSD(6.52)} subtitle="APY 4.2%" changeType="positive" icon={PiggyBank} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionFeed actions={data?.recentActions ?? []} />

        <div className="space-y-4">
          {/* Portfolio Chart */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold">Portfolio Value (7D)</h3>
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="font-mono font-medium">+5.9%</span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-2 h-[160px] mb-2">
                {portfolioHistory.map((d) => {
                  const height = ((d.value - minValue) / range) * 100 + 15;
                  const isPositive = d.pnl >= 0;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-mono ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {isPositive ? "+" : ""}{d.pnl}
                      </span>
                      <div
                        className={`w-full rounded-t-sm transition-all ${isPositive ? "bg-green-500/30 border border-green-500/50" : "bg-red-500/20 border border-red-500/40"}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {portfolioHistory.map((d) => (
                  <div key={d.day} className="flex-1 text-center">
                    <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                <span>Start: $980</span>
                <span className="text-green-400 font-medium">Current: $1,038</span>
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold mb-4">Asset Allocation</h3>

              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-4">
                {assetAllocation.map((a) => (
                  <div key={a.name} className={`${a.color}`} style={{ width: `${a.pct}%` }} />
                ))}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                {assetAllocation.map((a) => (
                  <div key={a.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                      <span className="text-sm">{a.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono">${a.value}</span>
                      <span className="text-xs text-muted-foreground ml-1">{a.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
