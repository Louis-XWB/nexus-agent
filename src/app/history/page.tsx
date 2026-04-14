"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatUSD, shortenTxHash } from "@/lib/utils";
import { History, ExternalLink } from "lucide-react";

interface Action { id: number; actionType: string; reason: string; amount: number | null; tokenFrom: string | null; tokenTo: string | null; txHash: string | null; status: string; confidence: number | null; route: string | null; pnl: number | null; createdAt: string; }

export default function HistoryPage() {
  const [actions, setActions] = useState<Action[]>([]);
  useEffect(() => { fetch("/api/dashboard").then((r) => r.json()).then((d) => setActions(d.recentActions || [])).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-in">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <History className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Transaction History</h1>
          <p className="text-sm text-slate-500">Complete log of agent decisions and executions</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass rounded-2xl overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.02] h-11">Time</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.02] h-11">Type</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.02] h-11">Details</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.02] h-11">Route</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.02] h-11">Status</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.02] h-11 text-right">Amount</TableHead>
              <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.02] h-11 text-right">P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((a) => (
              <TableRow key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <TableCell className="text-xs font-mono text-slate-500">{new Date(a.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "text-[10px] font-semibold border-0 px-2 py-0.5",
                    a.actionType === "SWAP" && "bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-400",
                    a.actionType === "DEFI_DEPOSIT" && "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400",
                    a.actionType === "SKIP" && "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400",
                    a.actionType === "x402_EARN" && "bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400",
                    a.actionType === "x402_PAY" && "bg-gradient-to-r from-rose-500/20 to-rose-600/10 text-rose-400",
                    !["SWAP", "DEFI_DEPOSIT", "SKIP", "x402_EARN", "x402_PAY"].includes(a.actionType) && "bg-white/[0.06] text-slate-400",
                  )}>{a.actionType}</Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-slate-300 truncate">{a.reason}</p>
                  {a.txHash && (
                    <a
                      href={`https://www.oklink.com/x-layer/tx/${a.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-mono mt-0.5 transition-colors"
                    >
                      {shortenTxHash(a.txHash)}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {a.route && (
                    <span className="text-xs font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md">{a.route}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "text-[10px] font-semibold border-0 px-2 py-0.5",
                    a.status === "success" && "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400",
                    a.status === "skipped" && "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400",
                    a.status === "failed" && "bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400",
                    a.status === "pending" && "bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-400",
                    !["success", "skipped", "failed", "pending"].includes(a.status) && "bg-white/[0.06] text-slate-400",
                  )}>{a.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-slate-300">{a.amount ? formatUSD(a.amount) : <span className="text-slate-600">-</span>}</TableCell>
                <TableCell className={cn(
                  "text-right font-mono text-sm font-semibold",
                  (a.pnl ?? 0) > 0 && "text-emerald-400",
                  (a.pnl ?? 0) < 0 && "text-red-400",
                  (a.pnl ?? 0) === 0 && "text-slate-600",
                )}>{a.pnl ? formatUSD(a.pnl) : <span className="text-slate-600">-</span>}</TableCell>
              </TableRow>
            ))}
            {actions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                      <History className="h-7 w-7 text-slate-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No transactions yet</p>
                    <p className="text-xs text-slate-600 mt-1">Agent activity will appear here</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
