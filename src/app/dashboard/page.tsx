"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActionFeed } from "@/components/dashboard/action-feed";
import { Wallet, TrendingUp, Zap, PiggyBank, ArrowUpRight } from "lucide-react";
import { formatUSD, formatPercent } from "@/lib/utils";

interface AgentAction { id: number; actionType: string; reason: string; amount: number | null; status: string; route: string | null; confidence: number | null; createdAt: string; }
interface DashboardData { recentActions: AgentAction[]; todayPnl: number; todayActionCount: number; x402Earnings: number; x402Calls: number; }

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
  { name: "USDC", pct: 45, color: "bg-blue-400", value: 467 },
  { name: "WETH", pct: 25, color: "bg-violet-400", value: 259 },
  { name: "OKB", pct: 15, color: "bg-amber-400", value: 156 },
  { name: "Aave", pct: 15, color: "bg-emerald-400", value: 156 },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    async function fetchData() { try { const res = await fetch("/api/dashboard"); if (res.ok) setData(await res.json()); } catch (e) { console.error(e); } }
    fetchData(); const interval = setInterval(fetchData, 30000); return () => clearInterval(interval);
  }, []);

  const maxVal = Math.max(...portfolioHistory.map(d => d.value));
  const minVal = Math.min(...portfolioHistory.map(d => d.value));
  const range = maxVal - minVal || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Autonomous agent performance on X Layer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value={formatUSD(1038)} change="+3.8%" changeType="positive" icon={Wallet} color="pink" />
        <StatCard title="Today P&L" value={formatUSD(data?.todayPnl ?? 0)} change={formatPercent(((data?.todayPnl ?? 0) / 1000) * 100)} changeType={(data?.todayPnl ?? 0) >= 0 ? "positive" : "negative"} icon={TrendingUp} color="green" />
        <StatCard title="x402 Revenue" value={formatUSD(data?.x402Earnings ?? 0)} subtitle={`${data?.x402Calls ?? 0} calls`} icon={Zap} color="purple" />
        <StatCard title="DeFi Yield" value={formatUSD(6.52)} subtitle="APY 4.2%" icon={PiggyBank} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActionFeed actions={data?.recentActions ?? []} />

        <div className="space-y-5">
          {/* Chart */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold">Portfolio Value (7D)</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm shadow-emerald-100">
                <ArrowUpRight className="h-3 w-3" /> +5.9%
              </span>
            </div>
            <div className="flex items-end gap-3 h-[150px] mb-3">
              {portfolioHistory.map((d) => {
                const h = ((d.value - minVal) / range) * 100 + 15;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-semibold ${d.pnl >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {d.pnl >= 0 ? "+" : ""}{d.pnl}
                    </span>
                    <div
                      className={`w-full rounded-lg transition-all hover:scale-105 ${d.pnl >= 0 ? "bg-gradient-to-t from-emerald-300 to-emerald-100" : "bg-gradient-to-t from-red-300 to-red-100"}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              {portfolioHistory.map((d) => (
                <div key={d.day} className="flex-1 text-center text-[10px] text-muted-foreground font-semibold">{d.day}</div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-black/[0.04] text-xs">
              <span className="font-mono text-muted-foreground">$980</span>
              <span className="font-mono font-bold text-emerald-600">$1,038</span>
            </div>
          </div>

          {/* Allocation */}
          <div className="card-elevated p-6">
            <h3 className="text-sm font-bold mb-5">Asset Allocation</h3>
            <div className="flex h-3 rounded-full overflow-hidden mb-5 bg-[#f0f0f5]">
              {assetAllocation.map((a) => (
                <div key={a.name} className={`${a.color} first:rounded-l-full last:rounded-r-full`} style={{ width: `${a.pct}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {assetAllocation.map((a) => (
                <div key={a.name} className="card-inner flex items-center justify-between px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                    <span className="text-[13px] text-muted-foreground">{a.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[13px] font-bold font-mono">${a.value}</span>
                    <span className="text-[10px] text-muted-foreground">{a.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
