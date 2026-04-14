"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatUSD, shortenTxHash } from "@/lib/utils";
import { ArrowUpRight, FileText } from "lucide-react";

interface Action { id: number; actionType: string; reason: string; amount: number | null; tokenFrom: string | null; tokenTo: string | null; txHash: string | null; status: string; confidence: number | null; route: string | null; pnl: number | null; createdAt: string; }

const STATUS_STYLES: Record<string, string> = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  skipped: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  failed:  "bg-red-500/10  text-red-400  border-red-500/20",
  pending: "bg-blue-500/10 text-blue-400  border-blue-500/20",
};

const TYPE_BORDER: Record<string, string> = {
  SWAP:         "border-l-blue-500/50",
  DEFI_DEPOSIT: "border-l-emerald-500/50",
  SKIP:         "border-l-yellow-500/50",
  x402_EARN:    "border-l-purple-500/50",
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return { date: d.toLocaleDateString([], { month: "short", day: "numeric" }), time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) };
}

export default function HistoryPage() {
  const [actions, setActions] = useState<Action[]>([]);
  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((d) => setActions(d.recentActions || [])).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Complete log of agent decisions and on-chain executions</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-2">
          <FileText className="h-3.5 w-3.5" />
          <span>{actions.length} records</span>
        </div>
      </div>

      <Card className="bg-card border-border overflow-hidden card-glow">
        {/* Sticky header */}
        <CardHeader className="p-0 sticky top-0 z-10 bg-[hsl(224_71%_3.5%)] border-b border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider w-[120px] pl-4">Time</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider w-[110px]">Type</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Details</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider w-[100px]">Route</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider w-[90px]">Status</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider text-right w-[90px]">Amount</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider text-right w-[80px] pr-4">P&L</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableBody>
              {actions.map((a, idx) => {
                const { date, time } = formatTime(a.createdAt);
                const borderClass = TYPE_BORDER[a.actionType] ?? "border-l-border";
                return (
                  <TableRow
                    key={a.id}
                    className={cn(
                      "border-l-[3px] border-b border-border/50 hover:bg-white/[0.025] transition-colors",
                      borderClass,
                      idx % 2 === 1 && "bg-white/[0.01]"
                    )}
                  >
                    {/* Time */}
                    <TableCell className="pl-4 py-3 align-top">
                      <div className="text-xs font-mono text-foreground/70">{date}</div>
                      <div className="text-[11px] font-mono text-muted-foreground/50">{time}</div>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="py-3 align-top">
                      <Badge variant="outline" className="text-[10px] font-mono font-semibold uppercase border-border/60 text-muted-foreground">
                        {a.actionType}
                      </Badge>
                    </TableCell>

                    {/* Details */}
                    <TableCell className="py-3 max-w-xs align-top">
                      <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">{a.reason}</p>
                      {a.txHash && (
                        <a
                          href={`https://www.oklink.com/x-layer/tx/${a.txHash}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary font-mono mt-1 transition-colors"
                        >
                          {shortenTxHash(a.txHash)}
                          <ArrowUpRight className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </TableCell>

                    {/* Route */}
                    <TableCell className="py-3 align-top">
                      {a.route && (
                        <Badge variant="secondary" className="text-[10px] font-mono">{a.route}</Badge>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3 align-top">
                      <Badge className={cn("text-[10px] font-medium border capitalize", STATUS_STYLES[a.status] ?? STATUS_STYLES.pending)}>
                        {a.status}
                      </Badge>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-right font-mono text-xs py-3 align-top text-foreground/80">
                      {a.amount ? formatUSD(a.amount) : <span className="text-muted-foreground/40">—</span>}
                    </TableCell>

                    {/* P&L */}
                    <TableCell className={cn(
                      "text-right font-mono text-xs py-3 pr-4 align-top font-semibold",
                      (a.pnl ?? 0) > 0 && "text-green-400",
                      (a.pnl ?? 0) < 0 && "text-red-400",
                      (a.pnl ?? 0) === 0 && "text-muted-foreground/40"
                    )}>
                      {a.pnl ? formatUSD(a.pnl) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {actions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <FileText className="h-8 w-8 opacity-20" />
                      <span className="text-sm">No transactions yet</span>
                      <span className="text-xs opacity-60">Agent activity will appear here</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
