import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, PiggyBank, ShieldX, Coins, Activity } from "lucide-react";

interface ActionItem {
  id: number; actionType: string; reason: string; amount: number | null;
  status: string; route: string | null; confidence: number | null; createdAt: string;
}

const actionConfig: Record<string, { icon: typeof ArrowRightLeft; border: string; iconBg: string; iconColor: string }> = {
  SWAP:         { icon: ArrowRightLeft, border: "border-l-blue-500/60",   iconBg: "bg-blue-500/10",   iconColor: "text-blue-400" },
  DEFI_DEPOSIT: { icon: PiggyBank,      border: "border-l-emerald-500/60", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400" },
  SKIP:         { icon: ShieldX,        border: "border-l-yellow-500/60", iconBg: "bg-yellow-500/10", iconColor: "text-yellow-400" },
  x402_EARN:    { icon: Coins,          border: "border-l-purple-500/60", iconBg: "bg-purple-500/10", iconColor: "text-purple-400" },
};
const defaultConfig = { icon: ArrowRightLeft, border: "border-l-muted-foreground/40", iconBg: "bg-muted/50", iconColor: "text-muted-foreground" };

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function ActionFeed({ actions }: { actions: ActionItem[] }) {
  return (
    <Card className="bg-card border-border card-glow">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-foreground">Recent Agent Actions</CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Activity className="h-3.5 w-3.5" />
          <span>{actions.length} actions</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {actions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Activity className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No actions yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">The agent will start trading soon</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {actions.map((action, idx) => {
                const cfg = actionConfig[action.actionType] ?? defaultConfig;
                const Icon = cfg.icon;
                return (
                  <div
                    key={action.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 border-l-[3px] hover:bg-white/[0.02] transition-colors",
                      cfg.border,
                      idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                    )}
                  >
                    <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md", cfg.iconBg)}>
                      <Icon className={cn("h-3.5 w-3.5", cfg.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={cn("text-[10px] h-4 px-1.5 font-mono font-semibold border-0 uppercase",
                          action.status === "success" && "bg-green-500/10 text-green-400",
                          action.status === "skipped" && "bg-yellow-500/10 text-yellow-400",
                          action.status === "failed"  && "bg-red-500/10 text-red-400",
                          (action.status !== "success" && action.status !== "skipped" && action.status !== "failed") && "bg-muted/50 text-muted-foreground"
                        )}>
                          {action.actionType}
                        </Badge>
                        {action.route && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-mono">{action.route}</Badge>
                        )}
                        <span className="text-[11px] text-muted-foreground/60 ml-auto tabular-nums">
                          {formatRelativeTime(action.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">{action.reason}</p>
                      {action.amount != null && (
                        <p className="text-[11px] text-muted-foreground font-mono">
                          <span className="text-foreground/60">${action.amount.toFixed(2)}</span>
                          {action.confidence != null && (
                            <span className="ml-2 text-muted-foreground/50">
                              conf: {(action.confidence * 100).toFixed(0)}%
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
