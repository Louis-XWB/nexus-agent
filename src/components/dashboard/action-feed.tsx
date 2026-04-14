import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, PiggyBank, ShieldX, Coins, Activity, TrendingUp } from "lucide-react";

interface ActionItem {
  id: number; actionType: string; reason: string; amount: number | null;
  status: string; route: string | null; confidence: number | null; createdAt: string;
}

const actionConfig: Record<string, { icon: typeof ArrowRightLeft; color: string; gradient: string; bg: string }> = {
  SWAP: { icon: ArrowRightLeft, color: "text-blue-400", gradient: "from-blue-500 to-blue-600", bg: "bg-blue-500/10" },
  DEFI_DEPOSIT: { icon: PiggyBank, color: "text-emerald-400", gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-500/10" },
  SKIP: { icon: ShieldX, color: "text-amber-400", gradient: "from-amber-500 to-amber-600", bg: "bg-amber-500/10" },
  x402_EARN: { icon: Coins, color: "text-purple-400", gradient: "from-purple-500 to-purple-600", bg: "bg-purple-500/10" },
  x402_PAY: { icon: Coins, color: "text-rose-400", gradient: "from-rose-500 to-rose-600", bg: "bg-rose-500/10" },
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
    <div className="glass rounded-2xl overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between p-5 pb-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Recent Agent Actions</h3>
            {actions.length > 0 && (
              <span className="text-[10px] font-mono text-slate-500">
                {actions.length} actions recorded
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </div>
      <ScrollArea className="h-[420px] px-3 pb-3 pt-2">
        <div className="space-y-2">
          {actions.map((action, i) => {
            const config = actionConfig[action.actionType] || actionConfig.SWAP;
            const Icon = config.icon;
            return (
              <div
                key={action.id}
                className="group relative rounded-xl overflow-hidden animate-fade-in hover:bg-white/[0.02] transition-all"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Gradient left accent */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-[3px] rounded-r bg-gradient-to-b",
                  config.gradient
                )} />

                <div className="pl-4 pr-3 py-3">
                  {/* Top line: type badge + route + time */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center", config.bg)}>
                      <Icon className={cn("h-3 w-3", config.color)} />
                    </div>
                    <Badge className={cn(
                      "text-[10px] px-2 py-0 h-5 border-0 font-semibold",
                      action.status === "success" && "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400",
                      action.status === "skipped" && "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400",
                      action.status === "failed" && "bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400",
                      !["success", "skipped", "failed"].includes(action.status) && "bg-white/[0.06] text-slate-400",
                    )}>{action.actionType}</Badge>
                    {action.route && (
                      <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded-md">
                        {action.route}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-600 ml-auto font-mono">{timeAgo(action.createdAt)}</span>
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-slate-400 leading-relaxed ml-8 mb-1">{action.reason}</p>

                  {/* Amount + confidence */}
                  {action.amount ? (
                    <div className="flex items-center gap-3 ml-8">
                      <span className="text-xs font-mono font-semibold text-slate-300">
                        ${action.amount.toFixed(2)}
                      </span>
                      {action.confidence != null && (
                        <span className="flex items-center gap-1 text-[10px] font-mono">
                          <TrendingUp className="h-2.5 w-2.5" />
                          <span className={action.confidence >= 0.7 ? "text-emerald-400" : "text-amber-400"}>
                            {(action.confidence * 100).toFixed(0)}%
                          </span>
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
          {actions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <div className="h-14 w-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                <Activity className="h-7 w-7 opacity-30" />
              </div>
              <p className="text-sm font-medium text-slate-400">No actions yet</p>
              <p className="text-xs mt-1 text-slate-600">Agent will start trading soon</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
