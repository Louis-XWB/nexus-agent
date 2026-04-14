"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActionFeed } from "@/components/dashboard/action-feed";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Zap, PiggyBank, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
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
  { name: "USDC",       pct: 45, color: "bg-blue-500",    hex: "#3b82f6", value: 467 },
  { name: "WETH",       pct: 25, color: "bg-purple-500",  hex: "#a855f7", value: 259 },
  { name: "OKB",        pct: 15, color: "bg-amber-500",   hex: "#f59e0b", value: 156 },
  { name: "Aave (DeFi)",pct: 15, color: "bg-emerald-500", hex: "#10b981", value: 156 },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) { setData(await res.json()); setLastUpdate(new Date()); }
      } catch (e) { console.error("Failed to fetch dashboard:", e); }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...portfolioHistory.map(d => d.value));
  const minValue = Math.min(...portfolioHistory.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Portfolio Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Autonomous agent performance on X Layer</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
            <span className="text-green-400 font-medium">Agent running</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets"  value={formatUSD(1038)} change="+3.8% (7D)"  changeType="positive" icon={Wallet} />
        <StatCard title="Today P&L"    value={formatUSD(data?.todayPnl ?? 0)} change={formatPercent(((data?.todayPnl ?? 0) / 1000) * 100)} changeType={(data?.todayPnl ?? 0) >= 0 ? "positive" : "negative"} icon={TrendingUp} />
        <StatCard title="x402 Revenue" value={formatUSD(data?.x402Earnings ?? 0)} subtitle={`${data?.x402Calls ?? 0} API calls`} icon={Zap} />
        <StatCard title="DeFi Yield"   value={formatUSD(6.52)} subtitle="APY 4.2%" changeType="positive" icon={PiggyBank} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionFeed actions={data?.recentActions ?? []} />

        <div className="space-y-4">
          {/* Portfolio Chart */}
          <Card className="bg-card border-border card-glow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold">Portfolio Value</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">7-day performance</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="font-mono">+5.9%</span>
                </div>
              </div>

              {/* Bar chart with gradient bars */}
              <div className="flex items-end gap-1.5 h-[140px] mb-1">
                {portfolioHistory.map((d) => {
                  const height = ((d.value - minValue) / range) * 100 + 15;
                  const isPositive = d.pnl >= 0;
                  const isToday = d.day === "Today";
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
                      <span className={`text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {isPositive ? "+" : ""}{d.pnl}
                      </span>
                      <div
                        className={`w-full rounded-t transition-all group-hover:scale-x-[1.05] origin-bottom ${
                          isToday
                            ? "bg-gradient-to-t from-blue-600/60 to-blue-400/40 border border-blue-500/40"
                            : isPositive
                            ? "bg-gradient-to-t from-green-600/40 to-green-400/20 border border-green-500/30"
                            : "bg-gradient-to-t from-red-600/35 to-red-400/15 border border-red-500/25"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex gap-1.5 border-t border-border/50 pt-2">
                {portfolioHistory.map((d) => (
                  <div key={d.day} className="flex-1 text-center">
                    <span className={`text-[10px] ${d.day === "Today" ? "text-blue-400 font-medium" : "text-muted-foreground/60"}`}>{d.day}</span>
                  </div>
                ))}
              </div>

              {/* Summary row */}
              <div className="flex justify-between mt-3 pt-3 border-t border-border/50 text-xs">
                <span className="text-muted-foreground font-mono">Start <span className="text-foreground/70">$980</span></span>
                <span className="text-green-400 font-mono font-semibold">Now $1,038</span>
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <Card className="bg-card border-border card-glow">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-4">Asset Allocation</h3>

              {/* Stacked bar — thicker, rounded */}
              <div className="flex h-4 rounded-lg overflow-hidden gap-[1px] mb-5 bg-muted/30 p-[2px]">
                {assetAllocation.map((a) => (
                  <div
                    key={a.name}
                    className={`${a.color} rounded-md transition-all hover:brightness-125 cursor-default`}
                    style={{ width: `${a.pct}%` }}
                    title={`${a.name}: ${a.pct}%`}
                  />
                ))}
              </div>

              {/* Legend grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {assetAllocation.map((a) => (
                  <div key={a.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-sm ${a.color} shrink-0`} />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{a.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-medium">${a.value}</span>
                      <span className="text-[10px] text-muted-foreground/60 ml-1.5">{a.pct}%</span>
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
