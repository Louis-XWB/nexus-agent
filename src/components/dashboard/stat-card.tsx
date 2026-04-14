import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden animate-fade-in">
      {/* Gradient border wrapper */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-500" />
      {/* Inner card */}
      <div className="relative m-[1px] rounded-[15px] bg-[rgba(15,23,42,0.6)] backdrop-blur-xl p-5 h-full border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
            changeType === "positive" && "from-emerald-500/20 to-emerald-600/10 shadow-emerald-500/10",
            changeType === "negative" && "from-red-500/20 to-red-600/10 shadow-red-500/10",
            changeType === "neutral" && "from-blue-500/20 to-purple-600/10 shadow-blue-500/10",
          )}>
            <Icon className={cn(
              "h-5 w-5",
              changeType === "positive" && "text-emerald-400",
              changeType === "negative" && "text-red-400",
              changeType === "neutral" && "text-blue-400",
            )} />
          </div>
        </div>
        <p className="text-3xl font-bold font-mono tracking-tight text-slate-100">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold font-mono px-2 py-0.5 rounded-lg",
              changeType === "positive" && "text-emerald-400 bg-emerald-500/10",
              changeType === "negative" && "text-red-400 bg-red-500/10",
              changeType === "neutral" && "text-slate-400 bg-white/[0.04]",
            )}>
              {changeType === "positive" && <TrendingUp className="h-3 w-3" />}
              {changeType === "negative" && <TrendingDown className="h-3 w-3" />}
              {changeType === "neutral" && <Minus className="h-3 w-3" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
