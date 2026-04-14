"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatUSD, shortenTxHash } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface Action { id: number; actionType: string; reason: string; amount: number | null; tokenFrom: string | null; tokenTo: string | null; txHash: string | null; status: string; confidence: number | null; route: string | null; pnl: number | null; createdAt: string; }

const typeColors: Record<string, string> = {
  SWAP: "bg-blue-50 text-blue-700", DEFI_DEPOSIT: "bg-emerald-50 text-emerald-700",
  SKIP: "bg-amber-50 text-amber-700", x402_EARN: "bg-violet-50 text-violet-700", x402_PAY: "bg-rose-50 text-rose-700",
};
const statusColors: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700", skipped: "bg-amber-50 text-amber-700", failed: "bg-red-50 text-red-700",
};

export default function HistoryPage() {
  const [actions, setActions] = useState<Action[]>([]);
  useEffect(() => { fetch("/api/dashboard").then((r) => r.json()).then((d) => setActions(d.recentActions || [])).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Complete log of agent decisions and executions</p>
      </div>

      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] hover:bg-[#fafafa] border-b border-black/[0.04]">
              <TableHead className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider h-11">Time</TableHead>
              <TableHead className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider h-11">Type</TableHead>
              <TableHead className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider h-11">Details</TableHead>
              <TableHead className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider h-11">Route</TableHead>
              <TableHead className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider h-11">Status</TableHead>
              <TableHead className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider h-11 text-right">Amount</TableHead>
              <TableHead className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider h-11 text-right">P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((a) => (
              <TableRow key={a.id} className="hover:bg-[#fafafa] border-b border-black/[0.03]">
                <TableCell className="text-xs text-muted-foreground font-mono py-4">{new Date(a.createdAt).toLocaleString()}</TableCell>
                <TableCell className="py-4"><Badge className={cn("text-[11px] font-semibold border-0 rounded-lg", typeColors[a.actionType] || "bg-gray-50 text-gray-700")}>{a.actionType}</Badge></TableCell>
                <TableCell className="max-w-xs py-4">
                  <p className="text-[13px] truncate">{a.reason}</p>
                  {a.txHash && <a href={`https://www.oklink.com/x-layer/tx/${a.txHash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-pink-500 hover:underline font-mono mt-1">{shortenTxHash(a.txHash)} <ExternalLink className="h-2.5 w-2.5" /></a>}
                </TableCell>
                <TableCell className="py-4">{a.route && <Badge variant="secondary" className="text-[10px] font-mono rounded-lg">{a.route}</Badge>}</TableCell>
                <TableCell className="py-4"><Badge className={cn("text-[11px] font-semibold border-0 rounded-lg", statusColors[a.status] || "bg-gray-50 text-gray-700")}>{a.status}</Badge></TableCell>
                <TableCell className="text-right font-mono text-[13px] py-4">{a.amount ? formatUSD(a.amount) : "–"}</TableCell>
                <TableCell className={cn("text-right font-mono text-[13px] font-semibold py-4", (a.pnl ?? 0) > 0 && "text-emerald-600", (a.pnl ?? 0) < 0 && "text-red-500")}>{a.pnl ? formatUSD(a.pnl) : "–"}</TableCell>
              </TableRow>
            ))}
            {actions.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-20 text-muted-foreground">No transactions yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
