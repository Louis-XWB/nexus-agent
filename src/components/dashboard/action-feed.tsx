import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, PiggyBank, ShieldX, Coins } from "lucide-react";

interface ActionItem {
  id: number; actionType: string; reason: string; amount: number | null;
  status: string; route: string | null; confidence: number | null; createdAt: string;
}

const config: Record<string, { icon: typeof ArrowRightLeft; bg: string; text: string }> = {
  SWAP: { icon: ArrowRightLeft, bg: "bg-blue-50", text: "text-blue-600" },
  DEFI_DEPOSIT: { icon: PiggyBank, bg: "bg-emerald-50", text: "text-emerald-600" },
  SKIP: { icon: ShieldX, bg: "bg-amber-50", text: "text-amber-600" },
  x402_EARN: { icon: Coins, bg: "bg-violet-50", text: "text-violet-600" },
  x402_PAY: { icon: Coins, bg: "bg-rose-50", text: "text-rose-600" },
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
    <div className="card-elevated overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.04]">
        <span className="text-sm font-bold">Recent Actions</span>
        <span className="text-xs text-muted-foreground bg-[#f7f7fa] px-2.5 py-1 rounded-full font-medium">{actions.length}</span>
      </div>
      <ScrollArea className="h-[460px]">
        {actions.map((action) => {
          const c = config[action.actionType] || config.SWAP;
          const Icon = c.icon;
          return (
            <div key={action.id} className="group px-6 py-3.5 border-b border-black/[0.03] hover:bg-[#fafafa] transition-colors">
              <div className="flex items-center gap-3 mb-1.5">
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", c.bg)}>
                  <Icon className={cn("h-4 w-4", c.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[11px] font-bold uppercase tracking-wide", c.text)}>{action.actionType}</span>
                    {action.route && <span className="text-[10px] font-mono text-muted-foreground bg-[#f0f0f5] px-1.5 py-0.5 rounded-md">{action.route}</span>}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{timeAgo(action.createdAt)}</span>
              </div>
              <p className="text-[12.5px] text-muted-foreground leading-relaxed pl-11">{action.reason}</p>
              {action.amount ? (
                <div className="flex items-center gap-3 pl-11 mt-1">
                  <span className="text-[11px] font-mono font-semibold">${action.amount.toFixed(2)}</span>
                  {action.confidence != null && (
                    <span className={cn("text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md",
                      action.confidence >= 0.7 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                      {(action.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
        {actions.length === 0 && <div className="py-20 text-center text-sm text-muted-foreground">No actions yet</div>}
      </ScrollArea>
    </div>
  );
}
