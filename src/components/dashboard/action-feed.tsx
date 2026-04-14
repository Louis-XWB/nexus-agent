import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, PiggyBank, ShieldX, Coins } from "lucide-react";

interface ActionItem {
  id: number; actionType: string; reason: string; amount: number | null;
  status: string; route: string | null; confidence: number | null; createdAt: string;
}

const actionIcons: Record<string, typeof ArrowRightLeft> = {
  SWAP: ArrowRightLeft, DEFI_DEPOSIT: PiggyBank, SKIP: ShieldX, x402_EARN: Coins,
};

export function ActionFeed({ actions }: { actions: ActionItem[] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle className="text-base">Recent Agent Actions</CardTitle></CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {actions.map((action) => {
              const Icon = actionIcons[action.actionType] || ArrowRightLeft;
              return (
                <div key={action.id} className="flex gap-3 rounded-lg border border-border p-3">
                  <div className="mt-0.5"><Icon className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs",
                        action.status === "success" && "border-green-500/50 text-green-400",
                        action.status === "skipped" && "border-yellow-500/50 text-yellow-400",
                        action.status === "failed" && "border-red-500/50 text-red-400")}>{action.actionType}</Badge>
                      {action.route && <Badge variant="secondary" className="text-xs">{action.route}</Badge>}
                      <span className="text-xs text-muted-foreground ml-auto">{new Date(action.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-foreground">{action.reason}</p>
                    {action.amount && <p className="text-xs text-muted-foreground font-mono">
                      ${action.amount.toFixed(2)}{action.confidence && ` | Confidence: ${(action.confidence * 100).toFixed(0)}%`}
                    </p>}
                  </div>
                </div>
              );
            })}
            {actions.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No actions yet. The agent will start trading soon.</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
