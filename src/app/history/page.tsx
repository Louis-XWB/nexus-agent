"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatUSD, shortenTxHash } from "@/lib/utils";

interface Action { id: number; actionType: string; reason: string; amount: number | null; tokenFrom: string | null; tokenTo: string | null; txHash: string | null; status: string; confidence: number | null; route: string | null; pnl: number | null; createdAt: string; }

export default function HistoryPage() {
  const [actions, setActions] = useState<Action[]>([]);
  useEffect(() => { fetch("/api/dashboard").then((r) => r.json()).then((d) => setActions(d.recentActions || [])).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Transaction History</h1><p className="text-sm text-muted-foreground">Complete log of agent decisions and executions</p></div>
      <Card className="bg-card border-border"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Time</TableHead><TableHead>Type</TableHead><TableHead>Details</TableHead>
            <TableHead>Route</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">P&L</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {actions.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="text-xs font-mono text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{a.actionType}</Badge></TableCell>
                <TableCell className="max-w-xs"><p className="text-sm truncate">{a.reason}</p>
                  {a.txHash && <a href={`https://www.oklink.com/x-layer/tx/${a.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-mono">{shortenTxHash(a.txHash)}</a>}
                </TableCell>
                <TableCell>{a.route && <Badge variant="secondary" className="text-xs">{a.route}</Badge>}</TableCell>
                <TableCell><Badge className={cn("text-xs", a.status === "success" && "bg-green-500/10 text-green-400", a.status === "skipped" && "bg-yellow-500/10 text-yellow-400", a.status === "failed" && "bg-red-500/10 text-red-400", a.status === "pending" && "bg-blue-500/10 text-blue-400")}>{a.status}</Badge></TableCell>
                <TableCell className="text-right font-mono text-sm">{a.amount ? formatUSD(a.amount) : "-"}</TableCell>
                <TableCell className={cn("text-right font-mono text-sm", (a.pnl ?? 0) > 0 && "text-green-400", (a.pnl ?? 0) < 0 && "text-red-400")}>{a.pnl ? formatUSD(a.pnl) : "-"}</TableCell>
              </TableRow>
            ))}
            {actions.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No transactions yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
