import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, PiggyBank, ShieldX, Coins, Activity } from "lucide-react";

interface ActionItem {
  id: number; actionType: string; reason: string; amount: number | null;
  status: string; route: string | null; confidence: number | null; createdAt: string;
}

const actionConfig: Record<string, { icon: typeof ArrowRightLeft; color: string; border: string; bg: string }> = {
  SWAP: { icon: ArrowRightLeft, color: "text-blue-400", border: "border-l-blue-500", bg: "bg-blue-500/10" },
  DEFI_DEPOSIT: { icon: PiggyBank, color: "text-emerald-400", border: "border-l-emerald-500", bg: "bg-emerald-500/10" },
  SKIP: { icon: ShieldX, color: "text-amber-400", border: "border-l-amber-500", bg: "bg-amber-500/10" },
  x402_EARN: { icon: Coins, color: "text-purple-400", border: "border-l-purple-500", bg: "bg-purple-500/10" },
  x402_PAY: { icon: Coins, color: "text-rose-400", border: "border-l-rose-500", bg: "bg-rose-500/10" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ActionFeed({ actions }: { actions: ActionItem[] }) {
  return (
    <div className="card-premium rounded-xl animate-fade-in">
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Recent Agent Actions</h3>
          {actions.length > 0 && (
            <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
              {actions.length}
            </span>
          )}
        </div>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </div>
      <ScrollArea className="h-[420px] px-3 pb-3">
        <div className="space-y-2">
          {actions.map((action, i) => {
            const config = actionConfig[action.actionType] || actionConfig.SWAP;
            const Icon = config.icon;
            return (
              <div
                key={action.id}
                className={cn(
                  "rounded-lg border-l-[3px] px-3 py-2.5 animate-fade-in",
                  config.border,
                  i % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("h-6 w-6 rounded-md flex items-center justify-center", config.bg)}>
                    <Icon className={cn("h-3 w-3", config.color)} />
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5",
                    action.status === "success" && "border-green-500/40 text-green-400",
                    action.status === "skipped" && "border-amber-500/40 text-amber-400",
                    action.status === "failed" && "border-red-500/40 text-red-400",
                  )}>{action.actionType}</Badge>
                  {action.route && (
                    <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                      {action.route}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(action.createdAt)}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{action.reason}</p>
                {action.amount ? (
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">
                    ${action.amount.toFixed(2)}
                    {action.confidence && (
                      <span className="ml-2">
                        Confidence: <span className={action.confidence >= 0.7 ? "text-green-400" : "text-amber-400"}>
                          {(action.confidence * 100).toFixed(0)}%
                        </span>
                      </span>
                    )}
                  </p>
                ) : null}
              </div>
            );
          })}
          {actions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Activity className="h-8 w-8 mb-3 opacity-30" />
              <p className="text-sm">No actions yet</p>
              <p className="text-xs mt-1">Agent will start trading soon</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
