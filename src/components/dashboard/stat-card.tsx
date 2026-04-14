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

const colorMap: Record<string, { bg: string; icon: string }> = {
  pink: { bg: "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100", icon: "text-pink-500" },
  green: { bg: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100", icon: "text-emerald-500" },
  purple: { bg: "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100", icon: "text-violet-500" },
  blue: { bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100", icon: "text-blue-500" },
};

export function StatCard({ title, value, change, changeType = "neutral", subtitle, icon: Icon, color = "pink" }: StatCardProps) {
  const c = colorMap[color] || colorMap.pink;
  return (
    <div className={cn("rounded-2xl border p-5", c.bg)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center bg-white/80 shadow-sm", c.icon)}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <p className="text-[28px] font-semibold tracking-tight">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        {change && (
          <span className={cn("text-xs font-medium",
            changeType === "positive" && "text-emerald-600",
            changeType === "negative" && "text-red-500",
            changeType === "neutral" && "text-muted-foreground",
          )}>{change}</span>
        )}
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
    </div>
  );
}
