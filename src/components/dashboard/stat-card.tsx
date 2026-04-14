import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

const colorMap: Record<string, { card: string; icon: string; iconBg: string }> = {
  pink:   { card: "bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100/50", icon: "text-pink-500", iconBg: "bg-white shadow-sm shadow-pink-200/50" },
  green:  { card: "bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50", icon: "text-emerald-600", iconBg: "bg-white shadow-sm shadow-emerald-200/50" },
  purple: { card: "bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100/50", icon: "text-violet-500", iconBg: "bg-white shadow-sm shadow-violet-200/50" },
  blue:   { card: "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100/50", icon: "text-blue-500", iconBg: "bg-white shadow-sm shadow-blue-200/50" },
};

export function StatCard({ title, value, change, changeType = "neutral", subtitle, icon: Icon, color = "pink" }: StatCardProps) {
  const c = colorMap[color] || colorMap.pink;
  return (
    <div className={cn("card-colored p-5 transition-all hover:scale-[1.02] cursor-default", c.card)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider">{title}</span>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", c.iconBg)}>
          <Icon className={cn("h-[18px] w-[18px]", c.icon)} />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <div className="flex items-center gap-2 mt-1.5">
        {change && (
          <span className={cn("text-xs font-semibold",
            changeType === "positive" && "text-emerald-600",
            changeType === "negative" && "text-red-500",
            changeType === "neutral" && "text-muted-foreground",
          )}>{change}</span>
        )}
        {subtitle && <span className="text-[11px] text-foreground/40">{subtitle}</span>}
      </div>
    </div>
  );
}
