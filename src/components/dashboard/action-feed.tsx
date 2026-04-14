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

const colors: Record<string, string> = {
  SWAP: "bg-blue-50 text-blue-600", DEFI_DEPOSIT: "bg-emerald-50 text-emerald-600",
  SKIP: "bg-amber-50 text-amber-600", x402_EARN: "bg-violet-50 text-violet-600", x402_PAY: "bg-rose-50 text-rose-600",
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
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <span className="text-sm font-semibold">Recent Actions</span>
        <span className="text-xs text-muted-foreground">{actions.length} total</span>
      </div>
      <ScrollArea className="h-[440px]">
        <div className="divide-y divide-border">
          {actions.map((action) => {
            const Icon = icons[action.actionType] || ArrowRightLeft;
            const color = colors[action.actionType] || "bg-gray-50 text-gray-600";
            return (
              <div key={action.id} className="px-5 py-3 hover:bg-secondary/30">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold">{action.actionType}</span>
                  {action.route && (
                    <Badge variant="secondary" className="text-[10px] h-[18px] font-mono">{action.route}</Badge>
                  )}
                  <span className="text-[11px] text-muted-foreground ml-auto">{timeAgo(action.createdAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-9">{action.reason}</p>
                {action.amount ? (
                  <p className="text-[11px] font-mono text-foreground/60 pl-9 mt-0.5">
                    ${action.amount.toFixed(2)}
                    {action.confidence != null && (
                      <span className={cn("ml-2", action.confidence >= 0.7 ? "text-emerald-600" : "text-amber-600")}>
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
