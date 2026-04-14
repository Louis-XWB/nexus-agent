import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, PiggyBank, ShieldX, Coins } from "lucide-react";

interface ActionItem {
  id: number; actionType: string; reason: string; amount: number | null;
  status: string; route: string | null; confidence: number | null; createdAt: string;
}

const icons: Record<string, typeof ArrowRightLeft> = {
  SWAP: ArrowRightLeft, DEFI_DEPOSIT: PiggyBank, SKIP: ShieldX, x402_EARN: Coins, x402_PAY: Coins,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function ActionFeed({ actions }: { actions: ActionItem[] }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium">Recent Actions</span>
        <span className="text-xs text-muted-foreground">{actions.length} total</span>
      </div>
      <ScrollArea className="h-[440px]">
        <div className="divide-y divide-border">
          {actions.map((action) => {
            const Icon = icons[action.actionType] || ArrowRightLeft;
            return (
              <div key={action.id} className="px-4 py-3 hover:bg-secondary/30">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Badge variant="outline" className={cn("text-[10px] h-[18px] px-1.5 font-mono",
                    action.status === "success" && "text-emerald-400 border-emerald-400/30",
                    action.status === "skipped" && "text-amber-400 border-amber-400/30",
                  )}>{action.actionType}</Badge>
                  {action.route && <span className="text-[10px] text-muted-foreground font-mono">{action.route}</span>}
                  <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(action.createdAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-5">{action.reason}</p>
                {action.amount ? (
                  <p className="text-[11px] font-mono text-foreground/70 pl-5 mt-0.5">
                    ${action.amount.toFixed(2)}
                    {action.confidence != null && (
                      <span className={cn("ml-2", action.confidence >= 0.7 ? "text-emerald-400" : "text-amber-400")}>
                        {(action.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </p>
                ) : null}
              </div>
            );
          })}
          {actions.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">No actions yet</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
