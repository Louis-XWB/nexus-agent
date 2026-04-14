"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActionFeed } from "@/components/dashboard/action-feed";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Zap, PiggyBank, ArrowUpRight, Activity, Hexagon } from "lucide-react";
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
  { name: "USDC", pct: 45, color: "from-blue-400 to-blue-600", dot: "bg-blue-500", value: 467 },
  { name: "WETH", pct: 25, color: "from-purple-400 to-purple-600", dot: "bg-purple-500", value: 259 },
  { name: "OKB", pct: 15, color: "from-amber-400 to-amber-600", dot: "bg-amber-500", value: 156 },
  { name: "Aave (DeFi)", pct: 15, color: "from-emerald-400 to-emerald-600", dot: "bg-emerald-500", value: 156 },
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
      {/* Hero Section */}
      <div className="relative glass rounded-2xl p-6 overflow-hidden animate-slide-up">
        {/* Background gradient decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold text-slate-100">Nexus Dashboard</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">
                <Wallet className="h-3 w-3 text-blue-400" />
                0x7a3b...9f2e
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">
                <Activity className="h-3 w-3 text-purple-400" />
                Cycle #{data?.todayActionCount ?? 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Value</p>
              <p className="text-3xl font-bold font-mono text-slate-100">$1,038</p>
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">7D P&L</p>
              <p className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="h-5 w-5" />
                +$58
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value={formatUSD(1038)} change="+3.8% (7D)" changeType="positive" icon={Wallet} />
        <StatCard title="Today P&L" value={formatUSD(data?.todayPnl ?? 0)} change={formatPercent(((data?.todayPnl ?? 0) / 1000) * 100)} changeType={(data?.todayPnl ?? 0) >= 0 ? "positive" : "negative"} icon={TrendingUp} />
        <StatCard title="x402 Revenue" value={formatUSD(data?.x402Earnings ?? 0)} subtitle={`${data?.x402Calls ?? 0} API calls`} icon={Zap} />
        <StatCard title="DeFi Yield" value={formatUSD(6.52)} subtitle="APY 4.2%" changeType="positive" icon={PiggyBank} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionFeed actions={data?.recentActions ?? []} />

        <div className="space-y-4">
          {/* Portfolio Chart */}
          <div className="glass rounded-2xl overflow-hidden animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Portfolio Value</h3>
                    <span className="text-[10px] text-slate-500 font-mono">7-day performance</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="font-mono font-bold">+5.9%</span>
                </div>
              </div>

              {/* Grid lines + bar chart */}
              <div className="relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none h-[160px]">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-full border-t border-white/[0.03]" />
                  ))}
                </div>

                {/* Y-axis labels */}
                <div className="absolute -left-1 inset-y-0 flex flex-col justify-between pointer-events-none h-[160px] text-[9px] font-mono text-slate-600">
                  <span>${maxValue}</span>
                  <span>${Math.round((maxValue + minValue) / 2)}</span>
                  <span>${minValue}</span>
                </div>

                {/* Bar chart */}
                <div className="flex items-end gap-2.5 h-[160px] mb-3 ml-6">
                  {portfolioHistory.map((d) => {
                    const height = ((d.value - minValue) / range) * 100 + 15;
                    const isPositive = d.pnl >= 0;
                    return (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <span className={`text-[10px] font-mono font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                          {isPositive ? "+" : ""}{d.pnl}
                        </span>
                        <div
                          className={`w-full rounded-lg transition-all duration-300 group-hover:scale-105 ${
                            isPositive
                              ? "bg-gradient-to-t from-emerald-500/20 via-emerald-500/30 to-emerald-400/40 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.1)]"
                              : "bg-gradient-to-t from-red-500/15 via-red-500/20 to-red-400/30 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.05)]"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2.5 ml-6">
                  {portfolioHistory.map((d) => (
                    <div key={d.day} className="flex-1 text-center">
                      <span className="text-[10px] font-medium text-slate-500">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-white/[0.04] text-xs">
                <span className="text-slate-500 font-mono">Start: <span className="text-slate-400">$980</span></span>
                <span className="text-emerald-400 font-mono font-semibold">Current: $1,038</span>
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="glass rounded-2xl overflow-hidden animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
                  <PiggyBank className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Asset Allocation</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Portfolio breakdown</span>
                </div>
              </div>

              {/* Glass bars */}
              <div className="space-y-3">
                {assetAllocation.map((a) => (
                  <div key={a.name} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${a.dot}`} />
                        <span className="text-sm font-medium text-slate-300">{a.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-slate-200">${a.value}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded">{a.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/[0.03] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${a.color} transition-all duration-500 group-hover:shadow-lg`}
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
