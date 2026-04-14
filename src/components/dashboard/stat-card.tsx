import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

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
    <div className="card-premium rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          changeType === "positive" && "bg-green-500/10",
          changeType === "negative" && "bg-red-500/10",
          changeType === "neutral" && "bg-blue-500/10",
        )}>
          <Icon className={cn(
            "h-4 w-4",
            changeType === "positive" && "text-green-400",
            changeType === "negative" && "text-red-400",
            changeType === "neutral" && "text-blue-400",
          )} />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
      <div className="flex items-center gap-2 mt-1.5">
        {change && (
          <span className={cn(
            "text-xs font-medium font-mono px-1.5 py-0.5 rounded",
            changeType === "positive" && "text-green-400 bg-green-500/10",
            changeType === "negative" && "text-red-400 bg-red-500/10",
            changeType === "neutral" && "text-muted-foreground",
          )}>
            {change}
          </span>
        )}
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
    </div>
  );
}
